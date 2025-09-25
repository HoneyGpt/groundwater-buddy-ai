import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, Crown, FileText, Zap, BookOpen, Database, Globe, Filter, Calendar, Star, Mic, Camera, MessageCircle, History, Save, DollarSign, Map, Gift, Phone, Home, Menu, X, Send, Settings, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { searchGoogle, searchGovernmentDocs, getSearchSuggestions } from '@/lib/googleSearchApi';
import { ProfileStorage } from '@/lib/storageUtils';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { HistoryPanel } from '@/components/dashboard/HistoryPanel';
import { DocumentSaverPanel } from '@/components/dashboard/DocumentSaverPanel';
import BudgetBroPanel from '@/components/dashboard/BudgetBroPanel';
import { MapsPanel } from '@/components/dashboard/MapsPanel';
import { CalendarPanel } from '@/components/dashboard/CalendarPanel';
import HelplinePanel from '@/components/dashboard/HelplinePanel';
import LearningPanel from '@/components/dashboard/LearningPanel';
import { SchemesPanel } from '@/components/dashboard/SchemesPanel';
// GoogleCSE removed to keep single search bar
import { GOVERNMENT_SECRETARIES } from '@/data/governmentSecretaries';

const Playground = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [academicResults, setAcademicResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'web' | 'government'>('web');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [activePanel, setActivePanel] = useState<string>('search');

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          navigate('/official-login');
          return;
        }

        setUser(session.user);
      } catch (error: any) {
        console.error('Auth error:', error);
        navigate('/official-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/official-login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your playground session.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadChat = (chat: any) => {
    setChatMessages(chat.messages);
  };

  const getUserInitials = () => {
    const name = user?.user_metadata?.name || 'Official User';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      let results: any[] = [];
      
      switch (activeTab) {
        case 'web':
          const webResults = await searchGoogle(query, { num: 10 });
          results = webResults.items || [];
          break;
          
        case 'government':
          const govResults = await searchGovernmentDocs(query, {});
          results = govResults.items || [];
          break;
      }
      
      setSearchResults(results);
      
      toast({
        title: "Search completed",
        description: `Found ${results.length} results for "${query}"`,
      });
      
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const suggestions = getSearchSuggestions(query);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchResults([]); // Clear search results when query is cleared
    }
  };

  const renderSearchResult = (result: any, index: number) => {
    return (
      <div key={index} className="group">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground truncate">
                {result.displayLink}
              </p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                INGRES-AI
              </span>
            </div>
            
            <h3 className="text-xl text-primary hover:text-primary/80 cursor-pointer mb-2 line-clamp-2 group-hover:underline">
              <a href={result.link} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </h3>
            
            <p className="text-sm text-foreground/70 line-clamp-2 mb-3 leading-relaxed">
              {result.snippet}
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href={result.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                Visit Site
              </a>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground ml-4 flex-shrink-0">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {index < searchResults.length - 1 && (
          <div className="border-b border-muted/30 mt-6"></div>
        )}
      </div>
    );
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', key: 'search' },
    { icon: MessageCircle, label: 'Chat', key: 'chat' },
    { icon: History, label: 'History', key: 'history' },
    { icon: Save, label: 'Document Saver', key: 'documents' },
    { icon: DollarSign, label: 'Budget Bro', key: 'budget' },
    { icon: Calendar, label: 'Calendar', key: 'calendar' },
    { icon: Map, label: 'Interactive Maps', key: 'maps' },
    { icon: Gift, label: 'Schemes', key: 'schemes' },
    { icon: Phone, label: 'Helpline', key: 'helpline' },
    { icon: BookOpen, label: 'Learn with INGRES - AI', key: 'learning' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                INGRES
              </span>
              <span className="text-foreground/60">-</span>
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/30 border-t-primary"></div>
            <p className="text-foreground/70 font-light">Initializing research environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white/20 dark:bg-black/20 backdrop-blur-md border-r border-white/20 dark:border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2">
              {!sidebarCollapsed && (
                activePanel === 'search' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="text-primary hover:text-primary/80 hover:bg-white/20"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActivePanel('search')}
                    className="text-primary hover:text-primary/80 hover:bg-white/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                )
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="rounded-full"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.key}
                variant={activePanel === item.key ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  activePanel === item.key 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-foreground/70 hover:text-foreground hover:bg-white/10'
                } ${sidebarCollapsed ? 'px-3' : ''}`}
                onClick={() => setActivePanel(item.key)}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-4 h-4 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                {!sidebarCollapsed && item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Navigation */}
        <nav className="flex justify-between items-center p-4 md:p-6">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-3 py-1">
              <Crown className="w-3 h-3 mr-1" />
              Official
            </Badge>
            
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="text-foreground/70 hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-destructive/70 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </nav>

        {/* Main Content Container */}
        {activePanel === 'search' ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            {/* INGRES-AI Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <h1 className="text-6xl md:text-8xl font-light tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    INGRES
                  </span>
                  <span className="text-foreground/80">-</span>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    AI
                  </span>
                </h1>
              </div>
              <p className="text-foreground/60 text-lg font-light">
                Indian Groundwater Research & Environmental Systems
              </p>
            </div>

            {/* Search Container */}
            <div className="w-full max-w-2xl mb-8">
              {/* Search Tabs */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full p-1 border border-white/30 dark:border-white/10">
                  <Button
                    variant={activeTab === 'web' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('web')}
                    className={activeTab === 'web' 
                      ? "rounded-full bg-primary text-primary-foreground shadow-md" 
                      : "rounded-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Web
                  </Button>
                  <Button
                    variant={activeTab === 'government' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('government')}
                    className={activeTab === 'government' 
                      ? "rounded-full bg-primary text-primary-foreground shadow-md" 
                      : "rounded-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Government
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="relative bg-white/70 dark:bg-black/20 backdrop-blur-md rounded-full border border-white/30 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/80 dark:hover:bg-black/30">
                  <div className="flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-foreground/50" />
                    <Input
                      placeholder={`Search ${activeTab} for groundwater research, policies, and data...`}
                      value={searchQuery}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="pl-12 pr-20 py-4 text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-foreground/40 rounded-full"
                    />
                    <div className="absolute right-2 flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        onClick={() => handleSearch()}
                        className="rounded-full w-9 h-9 p-0 bg-primary hover:bg-primary/90 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                          handleSearch(suggestion);
                        }}
                        className="w-full px-6 py-3 text-left hover:bg-white/50 dark:hover:bg-white/5 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Search className="w-4 h-4 text-foreground/40" />
                        <span className="text-foreground/80">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Suggestions Pills */}
              {searchQuery && (
                <div className="flex justify-center mt-6">
                  <div className="flex flex-wrap gap-3 max-w-4xl">
                    {[
                      `"groundwater levels ${searchQuery.split(' ').slice(-1)[0] || 'Karnataka'}"`,
                      `"water table depth monitoring"`,
                      `"irrigation schemes farmers"`
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion.replace(/"/g, ''));
                          handleSearch(suggestion.replace(/"/g, ''));
                        }}
                        className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-full text-sm transition-colors border border-muted-foreground/20"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Searches - Only show when no query */}
              {!searchQuery && (
                <div className="flex justify-center mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl">
                    <button
                      onClick={() => {
                        setSearchQuery("groundwater levels Karnataka");
                        handleSearch("groundwater levels Karnataka");
                      }}
                      className="p-3 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-foreground rounded-xl transition-all duration-300"
                    >
                      "groundwater levels Karnataka"
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery("water table depth monitoring");
                        handleSearch("water table depth monitoring");
                      }}
                      className="p-3 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-foreground rounded-xl transition-all duration-300"
                    >
                      "water table depth monitoring"
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery("irrigation schemes farmers");
                        handleSearch("irrigation schemes farmers");
                      }}
                      className="p-3 text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-foreground rounded-xl transition-all duration-300"
                    >
                      "irrigation schemes farmers"
                    </button>
                  </div>
                </div>
              )}
            </div>


            {activeTab === 'government' && (
              <div className="w-full max-w-6xl mt-8">
                <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="text-2xl font-light text-center">Government of India Secretaries</CardTitle>
                    <p className="text-center text-foreground/60">Contact information for key government departments</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 max-h-96 overflow-y-auto">
                      {GOVERNMENT_SECRETARIES.map((secretary) => (
                        <div key={secretary.srNo} className="bg-white/30 dark:bg-black/30 rounded-lg p-4 border border-white/30">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-lg text-primary">{secretary.name}</h3>
                              <p className="text-sm text-foreground/80 font-medium">{secretary.designation}</p>
                              <p className="text-sm text-foreground/70">{secretary.department}</p>
                              <div className="mt-2 text-sm text-foreground/60 whitespace-pre-line">
                                {secretary.contact}
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              #{secretary.srNo}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="w-full max-w-4xl mt-12">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground text-sm">
                    About {searchResults.length} results for "{searchQuery}"
                  </p>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {searchResults.map((result, index) => renderSearchResult(result, index))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            {(() => {
              const mockProfile = {
                name: user?.user_metadata?.name || 'Official User',
                location: 'Government Office',
                role: 'official'
              };

              switch (activePanel) {
                case 'chat':
                  return <ChatPanel profile={mockProfile} />;
                case 'history':
                  return <HistoryPanel onLoadChat={handleLoadChat} onSectionChange={setActivePanel} />;
                case 'documents':
                  return <DocumentSaverPanel />;
                case 'budget':
                  return <BudgetBroPanel profile={mockProfile} />;
                case 'maps':
                  return <MapsPanel />;
                case 'calendar':
                  return <CalendarPanel />;
                case 'helpline':
                  return <HelplinePanel />;
                case 'schemes':
                  return <SchemesPanel />;
                case 'learning':
                  return <LearningPanel />;
                case 'overview':
                default:
                  return <OverviewPanel profile={mockProfile} onSectionChange={setActivePanel} />;
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;