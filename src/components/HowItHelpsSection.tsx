import { MessageCircle, Search, CheckCircle } from "lucide-react";

const HowItHelpsSection = () => {
  const steps = [
    {
      step: "1",
      icon: MessageCircle,
      title: "Ask",
      description: "Ask your groundwater questions in simple language. No technical jargon needed - just ask naturally.",
      emoji: "💬",
    },
    {
      step: "2", 
      icon: Search,
      title: "See",
      description: "Get visual answers with maps, charts, and clear explanations. Complex data made simple and understandable.",
      emoji: "👀",
    },
    {
      step: "3",
      icon: CheckCircle,
      title: "Act",
      description: "Receive actionable insights and recommendations. Make informed decisions about water management.",
      emoji: "⚡",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How INGRES-AI Helps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to get the groundwater information you need
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{step.emoji}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-6 -translate-y-1/2">
                    <div className="w-12 h-px bg-border"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItHelpsSection;