import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Home, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm INGRES-AI, your friendly groundwater assistant. Ask me anything about groundwater data, well drilling, water quality, or government schemes for farmers! 🌊",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [apiKey] = useState('AIzaSyBPFPr_YNT5TVGZvwVvo0s6fTqbk3Gt2QU');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ingres-ai-chat-history');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory).map((chat: any) => ({
        ...chat,
        lastUpdated: new Date(chat.lastUpdated),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChatHistory(parsedHistory);
    }

    // Create initial chat if no history exists
    if (!savedHistory || JSON.parse(savedHistory).length === 0) {
      const initialChatId = Date.now().toString();
      setCurrentChatId(initialChatId);
      const initialChat: ChatHistory = {
        id: initialChatId,
        title: 'New Chat',
        messages: messages,
        lastUpdated: new Date()
      };
      setChatHistory([initialChat]);
      localStorage.setItem('ingres-ai-chat-history', JSON.stringify([initialChat]));
    } else {
      // Load the most recent chat
      const parsedHistory = JSON.parse(savedHistory);
      const mostRecent = parsedHistory[0];
      setCurrentChatId(mostRecent.id);
      setMessages(mostRecent.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Save current chat to history whenever messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      const currentChat: ChatHistory = {
        id: currentChatId,
        title: messages.find(m => m.isUser)?.text.slice(0, 30) + '...' || 'New Chat',
        messages: messages,
        lastUpdated: new Date()
      };

      setChatHistory(prev => {
        const filtered = prev.filter(chat => chat.id !== currentChatId);
        const updated = [currentChat, ...filtered].slice(0, 10); // Keep only 10 most recent
        localStorage.setItem('ingres-ai-chat-history', JSON.stringify(updated));
        return updated;
      });
    }
  }, [messages, currentChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are INGRES-AI, a friendly and helpful AI assistant specialized in groundwater data and management in India. You help farmers, citizens, researchers, and policymakers understand groundwater information from the INGRES portal.

Context: INGRES (India-WRIS Groundwater Resource Estimation System) contains groundwater assessment data across India including water levels, quality, extraction stages, and recharge information.

Your role:
- Provide clear, actionable advice about groundwater in simple language
- Help with crop planning based on water availability
- Explain government schemes for farmers related to water conservation
- Interpret groundwater assessment data (Critical/Semi-Critical/Safe stages)
- Suggest water conservation methods and rainwater harvesting
- Be encouraging and supportive, especially to farmers

Guidelines:
- Keep responses concise but helpful (2-3 sentences max for simple questions)
- Use friendly, encouraging language
- Provide specific actionable advice when possible
- If you don't have exact data, provide general guidance and suggest consulting local authorities
- Use emojis sparingly but appropriately

User question: ${userMessage}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I'm sorry, I'm having trouble processing your request right now. Could you please try rephrasing your question? 💧";
      }
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm experiencing some technical difficulties. Please try again in a moment! 🔧";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '...',
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const botResponse = await generateResponse(userMessage.text);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: "I'm sorry, something went wrong. Please try again! 🌊",
          isUser: false,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: '1',
        text: "Hello! I'm INGRES-AI, your friendly groundwater assistant. Ask me anything about groundwater data, well drilling, water quality, or government schemes for farmers! 🌊",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setShowHistory(false);
  };

  const loadChat = (chat: ChatHistory) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
    setShowHistory(false);
  };

  const deleteChat = (chatId: string) => {
    setChatHistory(prev => {
      const updated = prev.filter(chat => chat.id !== chatId);
      localStorage.setItem('ingres-ai-chat-history', JSON.stringify(updated));
      
      // If we deleted the current chat, start a new one
      if (chatId === currentChatId) {
        startNewChat();
      }
      
      return updated;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-water-50 to-accent-50">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-primary">INGRES-AI Public</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button
                onClick={startNewChat}
                variant="outline"
                size="sm"
              >
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Chat History Sidebar */}
        {showHistory && (
          <div className="w-80 bg-background/60 backdrop-blur-sm border-r border-border p-4">
            <h3 className="font-semibold text-primary mb-4">Chat History</h3>
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-accent/10 transition-colors ${
                      chat.id === currentChatId ? 'bg-accent/20 border-accent' : 'bg-background border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => loadChat(chat)}
                      >
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {chat.lastUpdated.toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col px-4 py-6">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-yellow-100 text-yellow-900 rounded-br-sm'
                        : 'bg-background border border-border rounded-bl-sm shadow-sm'
                    }`}>
                      {message.id === 'typing' ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Section */}
          <div className="mt-6 bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-lg">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about groundwater... 💧"
                  disabled={isLoading}
                  className="border-0 bg-transparent text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;