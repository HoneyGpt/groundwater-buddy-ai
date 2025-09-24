import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    __gcseLoaded?: boolean;
  }
}

const GoogleCSE = ({ cx = 'c35c85b4f765b4693' }: { cx?: string }) => {
  const exampleSearches = [
    "groundwater levels in Karnataka",
    "water table depth in my area", 
    "irrigation schemes for farmers",
    "monsoon impact on groundwater",
    "water conservation methods",
    "bore well drilling guidelines"
  ];

  useEffect(() => {
    // Avoid injecting the script multiple times
    if (!window.__gcseLoaded) {
      const script = document.createElement('script');
      script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`;
      script.async = true;
      script.onload = () => {
        window.__gcseLoaded = true;
      };
      document.body.appendChild(script);
    }
  }, [cx]);

  const handleExampleClick = (query: string) => {
    // Auto-search when clicking example
    setTimeout(() => {
      const searchElement = document.querySelector('.gsc-input');
      if (searchElement) {
        (searchElement as HTMLInputElement).value = query;
        const searchButton = document.querySelector('.gsc-search-button');
        if (searchButton) {
          (searchButton as HTMLButtonElement).click();
        }
      }
    }, 100);
  };

  return (
    <section aria-label="INGRES Search" className="bg-white/60 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-6">
      {/* Google CSE Search Widget */}
      <div className="gcse-search" />

      {/* Example Searches */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Try these searches:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleSearches.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-background/60 rounded-lg transition-colors border border-border/30 hover:border-primary/50"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoogleCSE;
