import { Button } from "@/components/ui/button";
import { Mail, Twitter, Github, Linkedin } from "lucide-react";
import ingresLogo from "@/assets/ingres-ai-logo-new.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={ingresLogo} 
                alt="INGRES-AI Logo" 
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground">INGRES-AI</h3>
                <p className="text-sm text-muted-foreground">Your Groundwater Buddy</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Making groundwater data accessible through AI-powered insights. 
              Empowering communities, farmers, and researchers with the information they need.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-accent transition-colors">Home</a></li>
              <li><a href="#features" className="text-muted-foreground hover:text-accent transition-colors">Features</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-accent transition-colors">How It Works</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>support@ingres-ai.com</li>
              <li>Research Institute</li>
              <li>Environmental Sciences</li>
              <li>Open Source Initiative</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 INGRES-AI. All rights reserved. Made with ❤️ for the environment.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;