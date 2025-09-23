import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Search documents..." }: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const quickSearches = [
    "show my Aadhaar card",
    "find government schemes",
    "my electricity bills",
    "health documents",
    "property papers",
    "bank statements",
    "insurance documents",
    "education certificates"
  ];

  const handleQuickSearch = (query: string) => {
    onChange(query);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onChange('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-20 h-11"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI
          </Badge>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && !value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 p-4">
          <div className="text-sm font-medium mb-3 text-foreground">Try these AI-powered searches:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickSearches.map((query, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(query)}
                className="text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                "{query}"
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI can understand natural language queries like "show my medical reports from last year"
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};