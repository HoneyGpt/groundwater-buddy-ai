import { Map, MessageSquare, Globe, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import interactiveMap from "@/assets/interactive-map.png";

const FeaturesSection = () => {
  const features = [
    {
      icon: Map,
      title: "Interactive Maps",
      description: "Visualize groundwater data with interactive maps and layers. Explore aquifer levels, quality measurements, and trends in your area.",
      image: interactiveMap,
    },
    {
      icon: MessageSquare,
      title: "Simple Language Queries",
      description: "Ask questions in plain language like 'How is the water quality in my area?' Get clear, understandable answers from complex data.",
    },
    {
      icon: Globe,
      title: "Local Language Support",
      description: "Communicate in your preferred language. INGRES-AI supports multiple languages to serve diverse communities worldwide.",
    },
    {
      icon: Zap,
      title: "Quick Actions & Suggestions",
      description: "Get smart suggestions and quick actions based on your location and interests. Save time with AI-powered recommendations.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Core Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to make groundwater information accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                    {feature.image && (
                      <div className="mt-4">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full rounded-lg shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;