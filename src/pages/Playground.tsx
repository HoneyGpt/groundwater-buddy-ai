import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, LogOut, Crown, FileText, Zap, BookOpen, Database, Globe, Filter, Calendar, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { searchGoogle, searchAcademicPapers, searchWaterResources, searchGovernmentDocs, searchPDFs, getSearchSuggestions } from '@/lib/googleSearchApi';
import { searchWorks, searchFunders, searchJournals, formatAuthors, formatPublicationDate } from '@/lib/crossrefApi';
import { ProfileStorage } from '@/lib/storageUtils';

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
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <h3 className="font-semibold text-primary hover:underline cursor-pointer">
              {result.title?.[0] || 'Untitled'}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {formatAuthors(result.author)} • {formatPublicationDate(result.published)}
            </p>
            {result['container-title']?.[0] && (
              <p className="text-sm text-accent font-medium">
                {result['container-title'][0]}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{result.type}</Badge>
              <a href={result.URL} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                DOI: {result.DOI}
              </a>
            </div>
          </div>
        </Card>
      );
    }
    
    return (
      <Card key={index} className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <h3 className="font-semibold text-primary hover:underline cursor-pointer">
            <a href={result.link} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground">{result.snippet}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-green-600">{result.displayLink}</span>
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
              Open
            </a>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading INGRES-AI Playground...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">I</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    INGRES-AI Playground
                  </h1>
                  <p className="text-xs text-muted-foreground">Research & Intelligence Hub</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Official
              </Badge>
              
              <Button
                onClick={() => navigate('/settings')}
                variant="ghost"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80"
              >
                <LogOut className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || 'Official User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.user_metadata?.department_id || 'Research Division'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Search Section */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-r from-background to-background/80 border-primary/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Global Knowledge Search</h2>
              <p className="text-muted-foreground">Search across web, academic papers, government docs, and research databases</p>
            </div>
            
            {/* Search Tabs */}
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2 bg-muted/30 p-1 rounded-lg">
                <Button
                  variant={activeTab === 'web' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('web')}
                  className="flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                  <span>Web</span>
                </Button>
                <Button
                  variant={activeTab === 'academic' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('academic')}
                  className="flex items-center space-x-1"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Academic</span>
                </Button>
                <Button
                  variant={activeTab === 'government' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('government')}
                  className="flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Government</span>
                </Button>
                <Button
                  variant={activeTab === 'crossref' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('crossref')}
                  className="flex items-center space-x-1"
                >
                  <Database className="w-4 h-4" />
                  <span>CrossRef</span>
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab} for research, data, and insights...`}
                  value={searchQuery}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-12 py-3 text-lg"
                />
                <Button
                  onClick={() => handleSearch()}
                  disabled={isSearching}
                  className="absolute right-1 top-1 px-4"
                >
                  {isSearching ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'Search'}
                </Button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                        handleSearch(suggestion);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Search Results ({searchResults.length})
              </h3>
              <Badge variant="outline" className="capitalize">
                {activeTab} Search
              </Badge>
            </div>
            
            <div className="grid gap-4">
              {searchResults.map((result, index) => renderSearchResult(result, index))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {searchResults.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Academic Research</h3>
                  <p className="text-sm text-muted-foreground">Search scholarly articles and papers</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Government Data</h3>
                  <p className="text-sm text-muted-foreground">Access official policies and reports</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">CrossRef Database</h3>
                  <p className="text-sm text-muted-foreground">Explore academic citations and metadata</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Playground;