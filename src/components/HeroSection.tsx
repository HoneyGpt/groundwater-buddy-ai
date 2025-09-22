import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-water-illustration.png";

const HeroSection = () => {
  return (
    <section id="home" className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your{" "}
              <span className="text-accent">Groundwater</span>{" "}
              Buddy
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl">
              Get instant answers about groundwater data in your local language. 
              INGRES-AI makes complex hydrogeological information simple and accessible 
              for farmers, researchers, and communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="accent" size="lg" className="group">
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="INGRES-AI with whales and marine life helping with groundwater research"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-accent/10 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;