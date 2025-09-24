import { useState } from "react";
import { Mail, Phone, MapPin, Send, Linkedin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const teamMembers = [
    { name: "Harshita Bhaskaruni", role: "Project Leader" },
    { name: "Tushar", role: "UI Designer" },
    { name: "Anchal", role: "Web Scrapper" },
    { name: "Ganesh", role: "Tester" },
    { name: "Saurav", role: "Debugger" },
    { name: "Vivek Upadhyay", role: "Customer Service" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about groundwater data? Need help with INGRES-AI? 
              We're here to help you make informed decisions about water resources.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Contact Form */}
              <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Send className="h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Direct Contact */}
              <Card className="border-2 border-accent/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Phone className="h-6 w-6 text-accent" />
                    Direct Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href="mailto:harshitabhaskaruni@gmail.com"
                          className="text-primary hover:underline"
                        >
                          harshitabhaskaruni@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Explore with Us</p>
                        <a 
                          href="https://in.linkedin.com/in/harshitabhaskaruni1117"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      Our Focus
                    </h3>
                    <p className="text-muted-foreground">
                      Providing intelligent groundwater insights across India through 
                      AI-powered analysis and real-time data visualization.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Section */}
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl">
                  <Users className="h-8 w-8 text-primary" />
                  Our Team
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Meet the dedicated professionals behind INGRES-AI
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/10 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-lg text-foreground mb-2">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;