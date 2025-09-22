import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-water-modern.png";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen bg-background flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Your{" "}
                <span className="text-accent block">Groundwater</span>
                <span className="block">Buddy</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Get instant answers about groundwater data in your local language. 
                INGRES-AI makes complex hydrogeological information simple and accessible.
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-accent hover:bg-accent/90 text-white">
                Ask Now
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:scale-110">
            <img
              src={heroImage}
              alt="INGRES-AI water-themed illustration with marine life"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;