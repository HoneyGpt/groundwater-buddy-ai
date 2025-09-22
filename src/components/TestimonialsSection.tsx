import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      role: "Small-scale Farmer, Brazil",
      content: "INGRES-AI helps me understand water quality in my fields. The local language support makes it so much easier to get the information I need for better crop management.",
      avatar: "👩‍🌾",
      rating: 5,
    },
    {
      name: "Dr. James Chen", 
      role: "Hydrologist, Research Institute",
      content: "The interactive maps and data visualization capabilities are impressive. It makes complex groundwater research accessible to field workers and communities.",
      avatar: "👨‍🔬",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "Community Water Manager, Kenya",
      content: "We use INGRES-AI to monitor water sources for our village. The simple interface helps us make informed decisions about water conservation and usage.",
      avatar: "👨‍💼",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Farmers, researchers, and communities trust INGRES-AI for groundwater insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-current" />
                ))}
              </div>
              <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;