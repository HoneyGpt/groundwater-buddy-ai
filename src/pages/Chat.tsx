import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
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
  const [apiKey] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: userMessage,
          context: { profile: { name: 'Guest', allowLocation: true } },
          chatType: 'ingres',
          useEnhancedKnowledge: true,
        },
      });

      if (error) throw error;

      if (data?.success && data?.response) {
        return data.response as string;
      }
      if (data?.fallbackResponse) {
        return data.fallbackResponse as string;
      }
      return "I'm sorry, I'm having trouble processing your request right now. Could you please try rephrasing your question? 💧";
    } catch (error) {
      console.error('Error generating response via Supabase:', error);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-water-50 to-accent-50" role="main">
      <Header />
      
      {/* Greeting Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Hello, friend! 🤗</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            I'm INGRES-AI! Ask me anything about groundwater data, well drilling, or water schemes for farmers.
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
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
                      ? 'bg-accent/20 text-accent' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-accent/20 text-accent-foreground rounded-br-sm'
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
                placeholder="Type your question here... 💧"
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

      <Footer />
    </div>
  );
};

export default Chat;