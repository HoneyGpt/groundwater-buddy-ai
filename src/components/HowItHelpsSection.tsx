const HowItHelpsSection = () => {
  const steps = [
    {
      emoji: "💬",
      title: "Ask",
      description: "Simply ask your groundwater questions in plain language or your local dialect."
    },
    {
      emoji: "📊",
      title: "See",
      description: "Get interactive maps, charts, and visual data tailored to your specific location."
    },
    {
      emoji: "⚡",
      title: "Act",
      description: "Receive actionable insights and recommendations to make informed decisions."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get the groundwater information you need in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl mb-6">{step.emoji}</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItHelpsSection;