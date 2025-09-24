import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, LogOut, Crown, FileText, Zap, BookOpen, Database, Globe, Filter, Calendar, Star, Mic, Camera, MessageCircle, History, Save, DollarSign, Map, Gift, Phone, Home, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { searchGoogle, searchAcademicPapers, searchWaterResources, searchGovernmentDocs, searchPDFs, getSearchSuggestions } from '@/lib/googleSearchApi';
import { searchWorks, searchFunders, searchJournals, formatAuthors, formatPublicationDate } from '@/lib/crossrefApi';
import { ProfileStorage } from '@/lib/storageUtils';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { HistoryPanel } from '@/components/dashboard/HistoryPanel';
import { DocumentSaverPanel } from '@/components/dashboard/DocumentSaverPanel';
import BudgetBroPanel from '@/components/dashboard/BudgetBroPanel';
import { MapsPanel } from '@/components/dashboard/MapsPanel';
import { CalendarPanel } from '@/components/dashboard/CalendarPanel';
import HelplinePanel from '@/components/dashboard/HelplinePanel';

const Playground = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [academicResults, setAcademicResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'web' | 'academic' | 'government' | 'crossref'>('web');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    const name = user?.user_metadata?.name || user?.email || 'Official';
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
          
        case 'academic':
          const academicResults = await searchAcademicPapers(query, {});
          results = academicResults.items || [];
          break;
          
        case 'government':
          const govResults = await searchGovernmentDocs(query, {});
          results = govResults.items || [];
          break;
          
        case 'crossref':
          const crossrefResults = await searchWorks(query, 10);
          results = crossrefResults.message.items || [];
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
    }
  };

  const renderSearchResult = (result: any, index: number) => {
    if (activeTab === 'crossref') {
      return (
        <div key={index} className="bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:bg-white/50 dark:hover:bg-black/30 transition-all duration-300 shadow-sm hover:shadow-lg">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-foreground hover:text-primary cursor-pointer transition-colors duration-200">
              <a href={result.URL} target="_blank" rel="noopener noreferrer">
                {result.title?.[0] || 'Untitled Research Paper'}
              </a>
            </h3>
            <p className="text-sm text-foreground/60">
              by {formatAuthors(result.author)} • {formatPublicationDate(result.published)}
            </p>
            {result['container-title']?.[0] && (
              <p className="text-sm text-primary font-medium">
                Published in: {result['container-title'][0]}
              </p>
            )}
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-white/20 border-white/30">
                {result.type}
              </Badge>
              <a 
                href={result.URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                <span>DOI: {result.DOI}</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={index} className="bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:bg-white/50 dark:hover:bg-black/30 transition-all duration-300 shadow-sm hover:shadow-lg">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-foreground/60">{result.displayLink}</span>
                <span className="w-1 h-1 bg-foreground/30 rounded-full"></span>
                <span className="text-xs text-foreground/40">INGRES-AI</span>
              </div>
              <h3 className="text-lg font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors duration-200 line-clamp-2">
                <a href={result.link} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              </h3>
              <p className="text-sm text-foreground/70 mt-2 line-clamp-3 leading-relaxed">
                {result.snippet}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a 
                href={result.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full transition-colors duration-200"
              >
                <Globe className="w-3 h-3" />
                <span>Visit Site</span>
              </a>
            </div>
            <span className="text-xs text-foreground/40">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
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
    { icon: Settings, label: 'Settings', key: 'settings' },
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/20 dark:bg-black/20 backdrop-blur-md border-r border-white/20 dark:border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IA</span>
              </div>
              <span className="font-semibold text-foreground">INGRES-AI</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
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
                }`}
                onClick={() => setActivePanel(item.key)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
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
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
              About
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
              Research
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
            
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
                Intelligent Groundwater Research & Environmental Systems
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
                      ? "rounded-full bg-white dark:bg-white/10 shadow-md" 
                      : "rounded-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Web
                  </Button>
                  <Button
                    variant={activeTab === 'academic' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('academic')}
                    className={activeTab === 'academic' 
                      ? "rounded-full bg-white dark:bg-white/10 shadow-md" 
                      : "rounded-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Academic
                  </Button>
                  <Button
                    variant={activeTab === 'government' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('government')}
                    className={activeTab === 'government' 
                      ? "rounded-full bg-white dark:bg-white/10 shadow-md" 
                      : "rounded-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Government
                  </Button>
                  <Button
                    variant={activeTab === 'crossref' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('crossref')}
                    className={activeTab === 'crossref' 
                      ? "rounded-full bg-white dark:bg-white/10 shadow-md" 
                    : "rounded-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                    }
                  >
                    <Database className="w-4 h-4 mr-2" />
                    CrossRef
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
                      <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 hover:bg-white/20">
                        <Mic className="w-4 h-4 text-foreground/60" />
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full w-9 h-9 p-0 hover:bg-white/20">
                        <Camera className="w-4 h-4 text-foreground/60" />
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

              {/* Search Buttons */}
              <div className="flex justify-center space-x-4 mt-8">
                <Button
                  onClick={() => handleSearch()}
                  disabled={isSearching}
                  className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/20 text-foreground rounded-full px-6 py-2 transition-all duration-300 hover:shadow-lg"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  INGRES Search
                </Button>
                <Button
                  onClick={() => {
                    const queries = ['groundwater india', 'water management', 'aquifer recharge', 'water policy'];
                    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
                    setSearchQuery(randomQuery);
                    handleSearch(randomQuery);
                  }}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-sm border border-white/20 text-foreground rounded-full px-6 py-2 transition-all duration-300"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  I'm Feeling Lucky
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="w-full max-w-4xl mt-12">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-foreground/60 text-sm">
                    About {searchResults.length} results for "{searchQuery}"
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-foreground/60">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
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
                name: user?.user_metadata?.name || user?.email || 'Official User',
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
                case 'settings':
                  return (
                    <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10">
                      <CardHeader>
                        <CardTitle className="text-2xl font-light">Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                      <Settings className="w-16 h-16 mx-auto text-foreground/40 mb-4" />
                      <h3 className="text-xl font-medium text-foreground/80 mb-2">
                        Settings Panel
                      </h3>
                      <p className="text-foreground/60">
                        Configure your INGRES-AI preferences and account settings.
                      </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
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