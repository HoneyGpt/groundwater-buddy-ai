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
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-primary/5 rounded-xl border shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary">INGRES-AI Chat</h2>
            <p className="text-xs text-muted-foreground">Your groundwater assistant</p>
          </div>
        </div>
        <Button
          onClick={handleSaveChat}
          variant="outline"
          size="sm"
          disabled={messages.length <= 1}
          className="hover:bg-accent/10"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Quick Query Buttons */}
      <div className="p-4 border-b bg-background/50">
        <p className="text-sm text-muted-foreground mb-3 font-medium">💡 Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQueries.map((query) => (
            <Button
              key={query}
              variant="outline"
              size="sm"
              onClick={() => handleSendMessage(query)}
              disabled={isLoading}
              className="text-xs hover:bg-accent/10 hover:border-accent hover:text-accent transition-all duration-200"
            >
              {query}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-start' : 'justify-end'} animate-fade-in mb-4`}
            >
              <div className={`flex items-start gap-3 max-w-[75%] ${message.isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                    : 'bg-gradient-to-br from-primary to-accent text-white'
                }`}>
                  {message.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`relative ${
                  message.isUser
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'
                    : 'bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20'
                } rounded-2xl px-4 py-3 shadow-sm`}>
                  {/* Message bubble arrow */}
                  <div className={`absolute top-4 w-0 h-0 ${
                    message.isUser
                      ? '-left-2 border-l-0 border-r-8 border-t-8 border-b-8 border-transparent border-r-blue-200'
                      : '-right-2 border-r-0 border-l-8 border-t-8 border-b-8 border-transparent border-l-primary/20'
                  }`}></div>
                  
                  {message.id === 'typing' ? (
                    <div className="flex space-x-1 py-2">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                    <>
                      {/* Parse response for Supabase vs Gemini content */}
                      {message.text.includes('📚 Supabase') || message.text.includes('🤖 Gemini') ? (
                        <div className="space-y-3">
                          {message.text.split('\n\n').map((section, idx) => (
                            <div key={idx}>
                              {section.startsWith('📚 Supabase') ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-yellow-600 font-semibold">📚 INGRES Knowledge Base</span>
                                  </div>
                                  <p className="text-sm leading-relaxed text-gray-800">
                                    {section.replace('📚 Supabase Knowledge:\n', '')}
                                  </p>
                                </div>
                              ) : section.startsWith('🤖 INGRES-AI') || section.startsWith('🤖 Gemini') ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-600 font-semibold">🇮🇳 INGRES-AI (Indian AI Technology)</span>
                                  </div>
                                  <p className="text-sm leading-relaxed text-gray-700">
                                    {section.replace('🤖 Gemini AI Suggestion:\n', '').replace('🤖 INGRES-AI Response:\n', '')}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm leading-relaxed">{section}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      )}
                      
                      {message.contextInfo && (
                        <div className="mt-3 pt-2 border-t border-border/30">
                          <p className="text-xs text-muted-foreground italic">
                            {message.contextInfo}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="p-4 border-t bg-background rounded-b-xl">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about groundwater... 💧"
              disabled={isLoading}
              className="border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 rounded-full px-4 py-2 h-12"
            />
          </div>
          
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            size="icon"
            disabled={isLoading || isListening}
            className={`rounded-full h-12 w-12 border-primary/20 hover:bg-primary/5 transition-all duration-200 ${
              isListening ? 'bg-accent/20 border-accent' : ''
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'text-accent' : 'text-primary'}`} />
          </Button>
          
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};