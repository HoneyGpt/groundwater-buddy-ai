import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Search, Heart, MapPin, Filter } from 'lucide-react';
import { helplineData, type Helpline } from '@/lib/helplineData';

const HelplinePanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ingres_favorite_helplines');
    return saved ? JSON.parse(saved) : [];
  });

  // Get unique states and categories
  const states = useMemo(() => {
    const stateSet = new Set(helplineData.map(h => h.state).filter(Boolean));
    return Array.from(stateSet).sort();
  }, []);

  const categories = useMemo(() => {
    const categorySet = new Set(helplineData.map(h => h.category));
    return Array.from(categorySet).sort();
  }, []);

  // Filter helplines based on search and filters
  const filteredHelplines = useMemo(() => {
    return helplineData.filter(helpline => {
      const matchesSearch = !searchTerm || 
        helpline.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        helpline.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        helpline.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = selectedState === 'all' || helpline.state === selectedState || !helpline.state;
      const matchesCategory = selectedCategory === 'all' || helpline.category === selectedCategory;
      
      return matchesSearch && matchesState && matchesCategory;
    }).sort((a, b) => {
      // Sort by priority first, then alphabetically
      const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.authority.localeCompare(b.authority);
    });
  }, [searchTerm, selectedState, selectedCategory]);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const toggleFavorite = (helplineId: string) => {
    const newFavorites = favorites.includes(helplineId)
      ? favorites.filter(id => id !== helplineId)
      : [...favorites, helplineId];
    
    setFavorites(newFavorites);
    localStorage.setItem('ingres_favorite_helplines', JSON.stringify(newFavorites));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'emergency': return '🚨 Emergency';
      case 'high': return '🔴 High Priority';
      case 'medium': return '🟡 Medium';
      case 'low': return '🟢 Low Priority';
      default: return priority;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Emergency & Helpline Numbers</h1>
        <p className="text-muted-foreground">
          Quick access to important helpline numbers across India. Click to call directly.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search helplines... (e.g., Water, Police, Women)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[150px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredHelplines.length} helpline{filteredHelplines.length !== 1 ? 's' : ''}
        </p>
        {favorites.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
          </p>
        )}
      </div>

      {/* Helpline Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHelplines.map((helpline) => (
          <Card key={helpline.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg leading-tight">{helpline.authority}</CardTitle>
                  <Badge variant={getPriorityColor(helpline.priority)} className="text-xs">
                    {getPriorityLabel(helpline.priority)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(helpline.id)}
                  className="p-1 h-8 w-8"
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      favorites.includes(helpline.id) 
                        ? 'fill-primary text-primary' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {helpline.purpose}
              </p>
              
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  {helpline.category}
                </Badge>
                {helpline.state && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {helpline.state}
                  </Badge>
                )}
                {helpline.district && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {helpline.district}
                  </Badge>
                )}
              </div>
              
              <Button 
                onClick={() => handleCall(helpline.phone)}
                className="w-full"
                variant={helpline.priority === 'emergency' ? 'destructive' : 'default'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call {helpline.phone}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHelplines.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-2">
            <Search className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No helplines found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </div>
        </div>
      )}

      {/* Quick Emergency Section */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            🚨 Quick Emergency Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleCall('112')}
              className="text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Emergency 112
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleCall('100')}
              className="text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Police 100
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleCall('101')}
              className="text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Fire 101
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleCall('102')}
              className="text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Ambulance 102
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelplinePanel;