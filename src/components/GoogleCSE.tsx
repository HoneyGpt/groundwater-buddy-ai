import { useEffect } from 'react';

declare global {
  interface Window {
    __gcseLoaded?: boolean;
  }
}

const GoogleCSE = ({ cx = 'c35c85b4f765b4693' }: { cx?: string }) => {
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

  return (
    <section aria-label="Google Custom Search" className="bg-white/60 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4">
      <div className="gcse-search" />
    </section>
  );
};

export default GoogleCSE;
