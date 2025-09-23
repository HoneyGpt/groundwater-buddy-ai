import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, Send, Save, IndianRupee, Heart, Droplets, Wheat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Message interface for Budget Bro
interface BudgetMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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

  const getBudgetResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Extract budget from message
    const budgetMatch = message.match(/₹?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;
    
    // Budget-focused health responses
    if (lowerMessage.includes('health') || lowerMessage.includes('disease') || lowerMessage.includes('sick') || lowerMessage.includes('kidney') || lowerMessage.includes('diabetes') || lowerMessage.includes('fever') || lowerMessage.includes('pain')) {
      if (budget && budget <= 500) {
        return `💊 **Health Solutions for ₹${budget}:**

🏥 **Government Options (₹0-100):**
• Visit PHC/CHC for free consultation & basic medicines
• Ayushman Bharat card - free treatment up to ₹5 lakh
• Generic medicines from Jan Aushadhi store (70% cheaper)

💡 **Immediate Relief (₹50-200):**
• Drink turmeric milk + ginger tea for inflammation
• ORS packets for dehydration (₹10 each)
• Basic pain relief from government dispensary

📞 **Emergency Help:** Call 108 (free ambulance)
🏪 **Pharmacy:** Generic store near government hospital

Need specific medicine alternatives or government health schemes info?`;
      } else if (budget && budget <= 2000) {
        return `💊 **Health Solutions for ₹${budget}:**

🔬 **Tests & Treatment (₹500-1500):**
• Basic blood tests at government lab (₹200-400)
• Generic medicines for 2-3 months (₹300-800)
• Consultation at district hospital (₹50-100)

🌿 **Long-term Care (₹200-500):**
• Ayurvedic medicines from AYUSH dispensary
• Monthly vitamin supplements (₹150-300)
• Regular health monitoring at Anganwadi

💰 **Save Money Tips:**
• Buy medicines in bulk (30% discount)
• Use government insurance schemes
• Join self-help group for medical fund

Want government hospital contacts or insurance enrollment help?`;
      } else {
        return `💊 **Comprehensive Health Plan for ₹${budget || 5000}+:**

🏥 **Complete Care Package:**
• Full health checkup at private clinic (₹2000-4000)
• 6-month medicine supply (₹1500-3000)
• Emergency fund setup (₹2000-5000)

🎯 **Prevention Focus:**
• Annual health insurance (₹3000-8000)
• Regular monitoring devices (₹1500-3000)
• Nutrition supplements (₹1000-2000)

📱 **Tech Solutions:**
• Teleconsultation apps (₹300-500/month)
• Health tracking devices (₹2000-5000)

Ready to create a detailed health budget plan?`;
      }
    }

    // Budget-focused water solutions
    if (lowerMessage.includes('water') || lowerMessage.includes('bore') || lowerMessage.includes('well') || lowerMessage.includes('drought') || lowerMessage.includes('irrigation')) {
      if (budget && budget <= 1000) {
        return `💧 **Water Solutions for ₹${budget}:**

🏠 **Home Solutions (₹100-500):**
• Plastic water storage tank (₹400-800)
• Simple water filter (₹200-400)
• Drip irrigation bottles for kitchen garden (₹100-200)

🌧️ **Rainwater Collection (₹300-800):**
• Tarpaulin sheet collection system (₹300-500)
• Bucket & pipe setup (₹200-400)
• Government subsidy available (up to 90%)

💡 **Smart Savings:**
• Share community bore well (₹50-100/month)
• Join water tanker group booking (₹30-60/family)
• Use govt. water ATM (₹2-5 per 20L)

Apply for PM Krishi Sinchai Yojana - up to ₹50,000 subsidy!`;
      } else if (budget && budget <= 15000) {
        return `💧 **Water Solutions for ₹${budget}:**

🚜 **Farm Irrigation (₹5000-12000):**
• Drip system for 0.5-1 acre (₹8000-12000)
• Sprinkler system setup (₹6000-10000)
• Solar water pump (₹12000-15000 with subsidy)

🏗️ **Infrastructure (₹3000-8000):**
• Rainwater harvesting tank (₹8000-12000)
• Farm pond lining (₹5000-8000)
• Bore well repair & deepening (₹8000-15000)

💰 **Government Support:**
• 75% subsidy under PMKSY scheme
• Bank loan at 4% interest
• Zero-interest SHG loans available

Want scheme application help or contractor contacts?`;
      }
    }

    // Budget-focused crop and farming solutions
    if (lowerMessage.includes('crop') || lowerMessage.includes('farm') || lowerMessage.includes('harvest') || lowerMessage.includes('seed') || lowerMessage.includes('agriculture')) {
      if (budget && budget <= 2000) {
        return `🌾 **Farming Solutions for ₹${budget}:**

🌱 **Seeds & Inputs (₹500-1500):**
• Drought-resistant seeds from KVK (₹300-800)
• Organic compost making (₹200-500)
• Neem-based pesticide (₹100-300)

💧 **Water-Smart Farming (₹300-1000):**
• Mulching with crop residue (₹200-400)
• Bottle drip irrigation (₹300-600)
• Rainwater collection in farm (₹500-1000)

📈 **Quick Returns:**
• Vegetable farming (60-90 days cycle)
• Mushroom cultivation (₹1000 investment, ₹3000 return)
• Poultry (₹1500 for 25 chicks, ₹4000 return in 45 days)

Get free training at Krishi Vigyan Kendra!`;
      } else {
        return `🌾 **Complete Farming Plan for ₹${budget || 10000}+:**

🚜 **Modern Equipment (₹5000-15000):**
• Power tiller on rent (₹800-1200/day)
• Seed drill & fertilizer spreader (₹8000-12000)
• Solar fence for crop protection (₹10000-20000)

🌿 **Integrated Farming (₹8000-25000):**
• Crop + fish + poultry system
• Organic certification (₹5000, premium prices)
• Value addition unit (₹15000-30000)

💰 **Financing Options:**
• Kisan Credit Card (4% interest)
• NABARD schemes (up to ₹10 lakh)
• FPO membership benefits

Ready for a detailed crop planning session?`;
      }
    }

    // Budget-focused daily needs
    if (lowerMessage.includes('daily') || lowerMessage.includes('food') || lowerMessage.includes('grocery') || lowerMessage.includes('household') || lowerMessage.includes('family')) {
      if (budget && budget <= 500) {
        return `🏠 **Daily Needs for ₹${budget}:**

🍚 **Food Essentials (₹200-400):**
• Rice/wheat from PDS (₹2-3/kg)
• Dal & oil from cooperative (30% cheaper)
• Seasonal vegetables from mandi (₹50-100/week)

🛍️ **Smart Shopping (₹100-200):**
• Buy in bulk with neighbors (10-20% discount)
• Use government fair price shops
• Group buying from wholesale market

💡 **Money-Saving Tips:**
• Cook extra, save fuel costs
• Use solar cooker (government subsidy available)
• Kitchen garden for daily vegetables (₹100 setup)

Want grocery shopping group contacts or PDS card help?`;
      } else {
        return `🏠 **Monthly Budget Plan for ₹${budget || 2000}:**

📋 **Complete Breakdown:**
• Food essentials (60%): ₹${Math.floor((budget || 2000) * 0.6)}
• Utilities (20%): ₹${Math.floor((budget || 2000) * 0.2)}
• Emergency fund (10%): ₹${Math.floor((budget || 2000) * 0.1)}
• Savings (10%): ₹${Math.floor((budget || 2000) * 0.1)}

💰 **Optimization Strategies:**
• Bulk buying saves 15-25%
• Community purchases for better rates
• Government subsidized items priority

📱 **Track & Save:**
• Use expense tracking apps
• Join local savings groups
• Participate in government welfare schemes

Ready for personalized budget planning?`;
      }
    }

    // Generic budget help
    return `💛 **Budget Bro Analysis:**

I see you mentioned: "${message}"

${budget ? `With your ₹${budget} budget, here's what I suggest:` : 'Let me help you with budget-friendly solutions:'}

🎯 **Smart Approach:**
• Prioritize urgent needs first
• Look for government subsidies (save 50-90%)
• Consider group buying for bulk discounts
• Use local cooperative stores

💡 **Next Steps:**
1. Tell me the specific problem/need
2. Share your location for local schemes
3. Mention timeline (urgent vs planned)

**Examples to try:**
• "Diabetes medicine for elderly, budget ₹800"
• "Small business setup, have ₹10,000"
• "Wedding expenses, need to save ₹50,000"

What specific challenge can I help you solve affordably? 💪`;
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
          text: response,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: BudgetMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry buddy, I'm having technical difficulties! Try again in a moment. Meanwhile, remember: every small saving counts! 💛",
          isUser: false,
          timestamp: new Date(),
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
    const chatHistory = localStorage.getItem('budget_bro_history') || '[]';
    const history = JSON.parse(chatHistory);
    
    const chatSession = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      messages: messages,
      summary: messages.length > 1 ? `Budget chat: ${messages[1]?.text?.substring(0, 50)}...` : 'Budget Bro session'
    };
    
    history.unshift(chatSession);
    localStorage.setItem('budget_bro_history', JSON.stringify(history.slice(0, 50))); // Keep last 50 chats
    
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
                  <div className="text-sm whitespace-pre-wrap">
                    {message.text}
                  </div>
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