import { Map, MessageSquare, Globe, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Map,
      title: "Interactive Maps",
      description: "Visualize groundwater data with interactive maps and layers. Explore aquifer levels, quality measurements, and trends.",
    },
    {
      icon: MessageSquare,
      title: "Simple Language Queries",
      description: "Ask questions in plain language and get clear, understandable answers from complex hydrogeological data.",
    },
    {
      icon: Globe,
      title: "Local Language Support",
      description: "Communicate in your preferred language. INGRES-AI supports multiple languages for diverse communities.",
    },
    {
      icon: Zap,
      title: "Quick Actions & Suggestions",
      description: "Get smart suggestions and quick actions based on your location and interests with AI-powered recommendations.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Core Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful tools designed to make groundwater information accessible to everyone
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start space-x-6">
                <div className="p-4 bg-accent/10 rounded-2xl flex-shrink-0">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;