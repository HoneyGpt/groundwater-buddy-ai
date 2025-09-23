import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Save, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  contextInfo?: string;
}

interface ChatPanelProps {
  profile?: any;
}

const quickQueries = [
  "What's the groundwater status in Punjab?",
  "Which water conservation schemes can I apply for?",
  "Show me drip irrigation benefits",
  "What are rainwater harvesting methods?",
  "Help with PMKSY scheme eligibility", 
  "Conservation tips for farmers"
];

export const ChatPanel = ({ profile }: ChatPanelProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${profile?.name || 'friend'}! I'm INGRES-AI, your groundwater assistant. Ask me anything about water levels, farming tips, or government schemes! 🌊`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string, useEnhanced = true) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
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
      console.log('Sending message to INGRES AI:', messageText);
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: messageText,
          context: { profile },
          chatType: 'ingres',
          useEnhancedKnowledge: useEnhanced
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      let botResponse = '';
      let contextInfo = '';
      
      if (data?.success && data?.response) {
        console.log('Received AI response successfully');
        botResponse = data.response;
        
        // Add context information if available
        if (data?.context_used) {
          const ctx = data.context_used;
          contextInfo = `📚 Used ${ctx.knowledge_items || 0} knowledge items, ${ctx.schemes_found || 0} schemes, ${ctx.conservation_tips || 0} tips${typeof ctx.location_data !== 'undefined' ? `, ${ctx.location_data} location datapoints` : ''}`;
        }
      } else if (data?.fallbackResponse) {
        console.log('Using fallback response');
        botResponse = data.fallbackResponse;
      } else {
        throw new Error('Invalid response from AI service');
      }
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: botResponse,
          isUser: false,
          timestamp: new Date(),
          contextInfo: contextInfo || undefined
        }];
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Remove typing indicator and add fallback response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [...filtered, {
          id: Date.now().toString(),
          text: "🌊 I'm INGRES-AI, your groundwater assistant! I'm having some technical difficulties right now, but I can still help you with groundwater information, government schemes, and water conservation tips. Please try asking again!",
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

  const handleSaveChat = () => {
    const chatData = {
      id: Date.now().toString(),
      name: messages.find(m => m.isUser)?.text.slice(0, 30) + '...' || 'New Chat',
      createdAt: new Date().toISOString(),
      messages: messages.filter(m => m.id !== 'typing')
    };

    const existingChats = JSON.parse(localStorage.getItem('ingres_chats') || '[]');
    const updatedChats = [chatData, ...existingChats].slice(0, 20); // Keep only 20 most recent
    localStorage.setItem('ingres_chats', JSON.stringify(updatedChats));

    toast({
      title: "Chat saved! 💾",
      description: "You can find it in your History section."
    });
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);
    // Mock voice input for now
    setTimeout(() => {
      setIsListening(false);
      setInputValue("Show me groundwater status in my area");
      toast({
        title: "Voice captured! 🎤",
        description: "Voice input is simulated for this demo."
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary">Chat with INGRES-AI</h2>
        <Button
          onClick={handleSaveChat}
          variant="outline"
          size="sm"
          disabled={messages.length <= 1}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Chat
        </Button>
      </div>

      {/* Quick Query Buttons */}
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQueries.map((query) => (
            <Button
              key={query}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(query)}
              disabled={isLoading}
              className="text-xs hover:bg-accent/10 hover:border-accent"
            >
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-primary/20 text-primary'
                }`}>
                  {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <Card className={`px-4 py-3 ${
                  message.isUser
                    ? 'bg-accent/10 border-accent/20'
                    : 'bg-background border-border'
                }`}>
                  {message.id === 'typing' ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      {message.contextInfo && (
                        <p className="text-xs text-muted-foreground mt-2 italic border-t border-border/50 pt-2">
                          {message.contextInfo}
                        </p>
                      )}
                    </>
                  )}
                </Card>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="p-4 border-t border-border bg-background/50">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about groundwater... 💧"
              disabled={isLoading}
              className="border-border/50 focus:border-accent"
            />
          </div>
          
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            size="icon"
            disabled={isLoading || isListening}
            className={`border-border/50 ${isListening ? 'bg-accent/20 border-accent' : ''}`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'text-accent' : ''}`} />
          </Button>
          
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};