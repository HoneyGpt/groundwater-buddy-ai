import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Target, Lightbulb, TrendingUp } from "lucide-react";

const About = () => {
  const teamMembers = [
    { name: "Harshita Bhaskaruni", role: "Team Leader, Coordinator", initials: "HB" },
    { name: "Tushar", role: "UI Designer", initials: "T" },
    { name: "Anchal", role: "Web Scraper", initials: "A" },
    { name: "Ganesh", role: "Tester", initials: "G" },
    { name: "Saurav", role: "Debugger", initials: "S" },
    { name: "Vivek Upadhyay", role: "Customer Service", initials: "VU" },
  ];

  const mentors = [
    { name: "Auron", role: "Mentor & dear friend", color: "bg-yellow-500", initials: "A" },
    { name: "Kishlaya", role: "Contributor & friend", color: "bg-gray-400", initials: "K" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              INGRES-AI
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              AI-Driven Chatbot for Groundwater Data
            </p>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Project Overview</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-destructive" />
                    The Problem
                  </h3>
                  <p className="text-muted-foreground">
                    Groundwater data on the INGRES portal is hard to access. Farmers, policymakers, 
                    and the public struggle with technical databases and complex information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent" />
                    Our Goal
                  </h3>
                  <p className="text-muted-foreground">
                    Make groundwater information simple, accessible, and multilingual for everyone - 
                    from farmers to researchers to policymakers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                <Users className="w-8 h-8 text-accent" />
                Our Team
              </h2>
              <p className="text-muted-foreground">Meet the passionate individuals behind INGRES-AI</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Avatar className="w-16 h-16 mx-auto mb-4">
                      <AvatarFallback className="bg-accent text-accent-foreground text-lg font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mentors & Contributors */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Mentors & Contributors</h2>
              <p className="text-muted-foreground">Special thanks to our guides and supporters</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {mentors.map((mentor, index) => (
                <Card key={index} className="text-center border-2 border-dashed">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-full ${mentor.color} mx-auto mb-4 flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{mentor.initials}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{mentor.name}</h3>
                    <p className="text-muted-foreground">{mentor.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solution & Impact */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Lightbulb className="w-8 h-8 text-accent" />
                  Our Solution
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">AI-powered multilingual chatbot</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Real-time access to groundwater data</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Interactive maps & charts</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Simple explanations for everyone</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-muted-foreground">Integrated with INGRES portal</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-accent" />
                  Our Impact
                </h2>
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">For Farmers</h4>
                      <p className="text-sm text-muted-foreground">
                        Access water information and crop planning guidance in local languages
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">For Policymakers</h4>
                      <p className="text-sm text-muted-foreground">
                        Get accurate insights and data-driven decisions for water management
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-accent">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">For Everyone</h4>
                      <p className="text-sm text-muted-foreground">
                        Make groundwater management transparent, accessible, and user-friendly
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;