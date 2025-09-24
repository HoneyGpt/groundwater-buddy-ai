import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ingresLogo from "@/assets/ingres-ai-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={ingresLogo} 
              alt="INGRES-AI Logo" 
              className="h-12 w-12 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">INGRES-AI</h1>
              <p className="text-sm text-muted-foreground">Groundwater Buddy</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-accent transition-colors font-medium text-lg"
              >
                {item.name}
              </a>
            ))}
            <Button 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold"
              onClick={() => window.location.href = '/mediator'}
            >
              Ask Now
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-colors font-medium text-lg py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button 
                className="bg-accent hover:bg-accent/90 text-white px-8 py-3 text-lg font-semibold self-start mt-6"
                onClick={() => window.location.href = '/mediator'}
              >
                Ask Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;