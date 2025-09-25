import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Save, Mic, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatStorage, getCurrentContext } from '@/lib/storageUtils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  contextInfo?: string;
}

interface ChatPanelProps {
  profile?: any;
  initialChat?: any | null;
}

const quickQueries = [
  "What's the groundwater status in Punjab?",
  "Which water conservation schemes can I apply for?",
  "Show me drip irrigation benefits",
  "What are rainwater harvesting methods?",
  "Help with PMKSY scheme eligibility", 
  "Conservation tips for farmers"
];

export const ChatPanel = ({ profile, initialChat = null }: ChatPanelProps) => {
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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial chat if provided
  useEffect(() => {
    if (initialChat?.messages?.length) {
      const loaded = initialChat.messages.map((m: any, idx: number) => ({
        id: m.id || String(idx + 1),
        text: m.text || m.content || '',
        isUser: m.isUser ?? (m.role === 'user'),
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
      }));
      setMessages(loaded);
      setActiveChatId(initialChat.id || null);
    }
  }, [initialChat]);

  // Auto-save like ChatGPT after any message change
  useEffect(() => {
    const userMsgs = messages.filter(m => m.isUser);
    if (userMsgs.length === 0) return; // don't save welcome-only

    const chats = ChatStorage.get();
    const nameSource = userMsgs[0]?.text || 'New Chat';
    const chatName = `${nameSource.slice(0, 30)}${nameSource.length > 30 ? '…' : ''}`;

    const chatPayload = {
      id: activeChatId || String(Date.now()),
      name: chatName,
      createdAt: new Date().toISOString(),
      type: 'ingres' as const,
      messages: messages.filter(m => m.id !== 'typing').map(m => ({
        id: m.id,
        text: m.text,
        isUser: m.isUser,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : (m.timestamp || new Date().toISOString()),
      })),
    };

    const idx = chats.findIndex((c: any) => c.id === chatPayload.id);
    if (idx >= 0) {
      chats[idx] = chatPayload;
      ChatStorage.update(chats);
    } else {
      ChatStorage.add(chatPayload);
      setActiveChatId(chatPayload.id);
    }
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
      
      // Include conversation history for context
      const conversationHistory = messages.filter(m => m.id !== 'typing').slice(-10);
      
const { data, error } = await supabase.functions.invoke('enhanced-ai-chat', {
        body: {
          message: messageText,
          userProfile: profile,
          conversationHistory: conversationHistory
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
        
        // Add source information if available
        if (data?.sources) {
          const src = data.sources;
          contextInfo = `📊 Sources: ${src.supabase_results || 0} knowledge items${src.used_gemini ? ', AI analysis' : ''}`;
        }
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
          text: "🌊 **INGRES-AI Status**\n\nI'm experiencing technical difficulties but remain ready to assist you with:\n\n• **Groundwater Information** - Status and trends\n• **Government Schemes** - Eligibility and applications  \n• **Conservation Tips** - Practical water-saving methods\n• **Local Guidance** - Area-specific recommendations\n\nPlease try your question again! 💧",
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
    const userFirst = messages.find(m => m.isUser)?.text || 'New Chat';
    const chatData = {
      id: activeChatId || Date.now().toString(),
      name: `${userFirst.slice(0, 30)}${userFirst.length > 30 ? '…' : ''}`,
      type: 'ingres' as const,
      createdAt: new Date().toISOString(),
      messages: messages.filter(m => m.id !== 'typing')
    };

    const chats = ChatStorage.get();
    const idx = chats.findIndex((c: any) => c.id === chatData.id);
    if (idx >= 0) {
      chats[idx] = chatData;
      ChatStorage.update(chats);
    } else {
      ChatStorage.add(chatData);
      setActiveChatId(chatData.id);
    }

    const context = getCurrentContext();
    toast({
      title: "Chat saved! 💾",
      description: `Saved to your ${context === 'official' ? 'Playground' : 'Dashboard'} history.`
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

  const handleCopyMessage = async (messageText: string) => {
    try {
      await navigator.clipboard.writeText(messageText);
      toast({
        title: "Copied! 📋",
        description: "Message copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy message to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadMessage = (messageText: string, messageId: string) => {
    // Dynamic import for jsPDF to avoid bundle issues
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Add INGRES-AI header
      doc.setFontSize(20);
      doc.setTextColor(0, 100, 200);
      doc.text('INGRES-AI Chat Response', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      
      // Add message content
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      // Split text into lines that fit the page width
      const pageWidth = doc.internal.pageSize.width - 40; // 20mm margin on each side
      const lines = doc.splitTextToSize(messageText, pageWidth);
      
      let yPosition = 45;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.height - 40; // Leave margin at bottom
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += lineHeight;
      });
      
      // Save the PDF
      doc.save(`ingres-ai-response-${messageId}.pdf`);
      
      toast({
        title: "Downloaded! 📄",
        description: "Response saved as PDF file."
      });
    }).catch((error) => {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Error",
        description: "Failed to generate PDF. Downloading as text instead.",
        variant: "destructive"
      });
      
      // Fallback to text download
      const blob = new Blob([messageText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ingres-ai-response-${messageId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
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
                      {/* Enhanced structured response rendering */}
                      <div className="space-y-4">
                        {message.text.split(/\n\n---\n\n|\n\n/).map((section, idx) => {
                          const trimmedSection = section.trim();
                          if (!trimmedSection) return null;
                          
                          // Knowledge Base sections
                          if (trimmedSection.startsWith('📚 **INGRES Knowledge Base**')) {
                            return (
                              <div key={idx} className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-amber-600 font-semibold">📚 INGRES Knowledge Base</span>
                                </div>
                                <div className="text-sm leading-relaxed text-gray-800 space-y-2">
                                  {trimmedSection.replace('📚 **INGRES Knowledge Base**\n\n', '').split('\n\n').map((item, itemIdx) => (
                                    <div key={itemIdx} className="border-l-2 border-yellow-300 pl-3">
                                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                                        __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      }} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          
                          // AI Analysis sections
                          if (trimmedSection.startsWith('🤖 **INGRES-AI Analysis**') || trimmedSection.startsWith('🤖 **Additional Context**')) {
                            return (
                              <div key={idx} className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-blue-600 font-semibold">🇮🇳 INGRES-AI Analysis</span>
                                </div>
                                <div className="text-sm leading-relaxed text-gray-700">
                                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                                    __html: trimmedSection
                                      .replace(/🤖 \*\*INGRES-AI Analysis\*\*\n?/, '')
                                      .replace(/🤖 \*\*Additional Context\*\*\n?/, '')
                                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                      .replace(/• /g, '• ')
                                      .replace(/\n/g, '<br/>')
                                  }} />
                                </div>
                              </div>
                            );
                          }
                          
                          // General formatted content
                          return (
                            <div key={idx} className="text-sm leading-relaxed space-y-2">
                              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                                __html: trimmedSection
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/💧|🌊|📊|⚡|🇮🇳|📚|🤖/g, '<span class="text-lg">$&</span>')
                                  .replace(/• /g, '• ')
                                  .replace(/\n/g, '<br/>')
                              }} />
                            </div>
                          );
                        })}
                      </div>
                      
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
                      
                      {/* Action buttons for AI messages */}
                      {!message.isUser && message.id !== 'typing' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/20">
                          <Button
                            onClick={() => handleCopyMessage(message.text)}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-primary/10"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button
                            onClick={() => handleDownloadMessage(message.text, message.id)}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-primary/10"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
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