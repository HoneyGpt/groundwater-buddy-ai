import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Mr. Gopal", 
      role: "Wise Sarpanch",
      content: "As a farmer and sarpanch I can't believe that this type of technology exists, it's really a good work, the Telugu translation in chat helped a lot.",
      avatar: "👨‍🌾",
      rating: 5,
    },
    {
      name: "Mrs. Sulekha Subramanyam",
      role: "Senior Lecturer in Research University Delhi",
      content: "As a senior lecturer in research university this AI helped our students lot, I even advise this to agricultural students, I suggest to improve customer service response a bit more.",
      avatar: "👩‍🏫",
      rating: 4,
    },
    {
      name: "Mr. Mishra",
      role: "Senior & Sophomore, Birla Institute",
      content: "The website is very good, the UI and translation better than I expected. As a full stack developer I believe that this project helps India a lot.",
      avatar: "👨‍💻",
      rating: 4.5,
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
                {/* Filled stars */}
                {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                  <Star key={`filled-${i}`} className="h-5 w-5 text-accent fill-current" />
                ))}
                {/* Half star if rating has decimal */}
                {testimonial.rating % 1 !== 0 && (
                  <div key="half-star" className="relative">
                    <Star className="h-5 w-5 text-gray-300 fill-current" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star className="h-5 w-5 text-accent fill-current" />
                    </div>
                  </div>
                )}
                {/* Empty stars to complete 5-star rating */}
                {[...Array(5 - Math.ceil(testimonial.rating))].map((_, i) => (
                  <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-current" />
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