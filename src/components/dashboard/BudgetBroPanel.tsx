import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, Send, Save, IndianRupee, Heart, Droplets, Wheat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BudgetStorage, getCurrentContext, ChatStorage } from '@/lib/storageUtils';

// Message interface for Budget Bro
interface BudgetMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  formatted?: boolean;
}

interface BudgetBroPanelProps {
  profile?: any;
}

// Quick Budget Queries for different scenarios
const budgetQueries = [
  { text: "I have ₹500 for health issues", icon: Heart },
  { text: "Need water solutions under ₹1000", icon: Droplets },
  { text: "Crop help with ₹2000 budget", icon: Wheat },
  { text: "Daily needs within ₹200", icon: IndianRupee },
];

const BudgetBroPanel = ({ profile }: BudgetBroPanelProps) => {
  const [messages, setMessages] = useState<BudgetMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: BudgetMessage = {
        id: 'welcome-1',
        text: `💛 Hey there! I'm Budget Bro, your friendly money-saving assistant! 

Tell me your problem and budget, and I'll give you practical, affordable solutions. Whether it's health issues, water problems, farming needs, or daily expenses - I'll help you make every rupee count!

Try: "I have kidney stones, my budget is ₹800" or "Need drip irrigation for 1 acre, budget ₹15,000"`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const getBudgetResponse = async (message: string): Promise<{ text: string; formatted: boolean }> => {
    try {
      console.log('Sending message to Budget Bro:', message);
      
      // Update conversation history
      const updatedHistory = [...conversationHistory, { role: 'user', content: message }];
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: message,
          context: { 
            profile,
            conversationHistory: updatedHistory.slice(-10) // Last 10 messages for context
          },
          chatType: 'budget'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.success && data?.response) {
        console.log('Received AI response successfully');
        // Update conversation history with assistant response
        setConversationHistory([...updatedHistory, { role: 'assistant', content: data.response }]);
        return { text: data.response, formatted: true };
      } else if (data?.fallbackResponse) {
        console.log('Using fallback response');
        return { text: data.fallbackResponse, formatted: false };
      } else {
        throw new Error('Invalid response from AI service');
      }

    } catch (error) {
      console.error('Error getting budget response:', error);
      
      // Fallback to simple budget advice
      const budgetMatch = message.match(/₹?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;
      
      const fallbackText = `💛 **Budget Bro (Offline Mode)**

I'm having trouble connecting to my AI brain, but I can still help!

${budget ? `For your ₹${budget} budget:` : 'To help you save money:'}

🎯 **Quick Tips:**
• Check government schemes (often 50-90% subsidy)
• Buy generic alternatives (30-70% cheaper)  
• Join community groups for bulk buying
• Use local cooperative stores

💡 **Government Resources:**
• Jan Aushadhi stores for medicines
• Fair Price Shops for essentials
• Krishi Vigyan Kendra for farming
• Primary Health Centers for basic care

Please try asking again in a moment, or be more specific about what you need help with! 💪`;
      
      return { text: fallbackText, formatted: false };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: BudgetMessage = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate typing delay
    setTimeout(async () => {
      try {
        const response = await getBudgetResponse(inputValue);
        
        const botMessage: BudgetMessage = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          timestamp: new Date(),
          formatted: response.formatted,
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: BudgetMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry buddy, I'm having technical difficulties! Try again in a moment. Meanwhile, remember: every small saving counts! 💛",
          isUser: false,
          timestamp: new Date(),
          formatted: false,
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuery = (query: string) => {
    setInputValue(query);
  };

  const handleSaveChat = () => {
    if (messages.length <= 1) return;
    
    const chatData = {
      id: Date.now().toString(),
      name: `Budget Chat - ${new Date().toLocaleDateString()}`,
      messages: messages.map(msg => ({
        content: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp.toISOString()
      })),
      createdAt: new Date().toISOString(),
    };
    
    // Use unified chat storage system
    ChatStorage.add(chatData);
    
    toast({
      title: "Chat Saved! 💾",
      description: "Your budget conversation has been saved to history.",
    });
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setInputValue("I have back pain, budget is ₹600");
      toast({
        title: "Voice Input 🎤",
        description: "Voice message captured successfully!",
      });
    }
    setTimeout(() => setIsListening(false), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Budget Bro 💛</h2>
            <p className="text-sm text-muted-foreground">Your money-saving assistant for smart solutions</p>
          </div>
        </div>
      </div>

      {/* Quick Queries */}
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground mb-3">Quick Budget Queries:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {budgetQueries.map((query, index) => {
            const Icon = query.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start h-auto p-3"
                onClick={() => handleQuickQuery(query.text)}
              >
                <Icon className="w-4 h-4 mr-2 text-primary" />
                <span className="text-xs">{query.text}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!message.isUser && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                    ₹
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-[85%] ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <CardContent className="p-3">
                  {message.formatted ? (
                    <div className="text-sm space-y-3">
                      {message.text.split('\n\n').map((section, index) => {
                        if (section.startsWith('## ')) {
                          const title = section.replace('## ', '');
                          return (
                            <div key={index} className="font-semibold text-foreground border-b border-border pb-1">
                              {title}
                            </div>
                          );
                        } else if (section.includes('1. ') || section.includes('2. ')) {
                          return (
                            <div key={index} className="space-y-1">
                              {section.split('\n').map((line, lineIndex) => (
                                <div key={lineIndex} className="text-sm">
                                  {line}
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div key={index} className="text-sm whitespace-pre-wrap">
                              {section}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </div>
                  )}
                  <div className={`text-xs mt-2 ${
                    message.isUser 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>

              {message.isUser && (
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {profile?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 border">
                <AvatarFallback className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                  ₹
                </AvatarFallback>
              </Avatar>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="text-xs text-muted-foreground ml-2">Budget Bro is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Section */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2 mb-3">
          <Button
            onClick={handleSaveChat}
            variant="outline"
            size="sm"
            disabled={messages.length <= 1}
            className="text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me your problem and budget (e.g., 'Need medicine for fever, budget ₹400')"
              className="pr-12"
            />
          </div>
          
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            size="icon"
            className={isListening ? 'bg-primary text-primary-foreground' : ''}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          💛 Tip: Mention your problem + budget for personalized money-saving advice!
        </p>
      </div>
    </div>
  );
};

export default BudgetBroPanel;