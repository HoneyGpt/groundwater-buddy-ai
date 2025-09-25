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
    {
      name: "Mr. Mishra",
      role: "Senior & Sophomore, Birla Institute",
      content: "The website is very good, the UI and translation better than I expected. As a full stack developer I believe that this project helps India a lot.",
      avatar: "👨‍💻",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Farmers, researchers, and communities trust INGRES-AI for groundwater insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background rounded-2xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-accent fill-current" />
                ))}
              </div>
              <blockquote className="text-muted-foreground mb-8 leading-relaxed text-lg">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;