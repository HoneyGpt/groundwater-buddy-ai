import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Target, Lightbulb, TrendingUp, Award, Heart, Sparkles, MapPin, Mail, Phone, Calendar, Check, ArrowRight } from "lucide-react";

const About = () => {
  const teamMembers = [
    { 
      name: "Harshita Bhaskaruni", 
      role: "Team Leader, Coordinator", 
      initials: "HB",
      description: "Leading the vision and coordinating our diverse team to build accessible AI solutions",
      skills: ["Leadership", "Project Management", "Strategy"]
    },
    { 
      name: "Tushar", 
      role: "UI Designer", 
      initials: "T",
      description: "Crafting beautiful, intuitive interfaces that make complex data simple to understand",
      skills: ["UI Design", "User Experience", "Visual Design"]
    },
    { 
      name: "Anchal", 
      role: "Web Scraper", 
      initials: "A",
      description: "Building robust data pipelines to extract and process groundwater information",
      skills: ["Data Engineering", "Web Scraping", "API Integration"]
    },
    { 
      name: "Ganesh", 
      role: "Tester", 
      initials: "G",
      description: "Ensuring our chatbot delivers reliable, accurate responses for all users",
      skills: ["Quality Assurance", "Testing", "Bug Detection"]
    },
    { 
      name: "Saurav", 
      role: "Debugger", 
      initials: "S",
      description: "Solving complex technical challenges and optimizing system performance",
      skills: ["Debugging", "Problem Solving", "Performance"]
    },
    { 
      name: "Vivek Upadhyay", 
      role: "Customer Service", 
      initials: "VU",
      description: "Bridging the gap between users and technology, ensuring everyone gets help",
      skills: ["Customer Support", "Communication", "User Training"]
    },
  ];

  const mentors = [
    { 
      name: "Auron", 
      role: "Mentor & dear friend", 
      color: "from-yellow-400 to-yellow-600", 
      initials: "A",
      description: "Guiding our technical architecture and providing invaluable wisdom throughout our journey"
    },
    { 
      name: "Kishlaya", 
      role: "Contributor & friend", 
      color: "from-gray-400 to-gray-600", 
      initials: "K",
      description: "Contributing expertise in AI and helping us navigate complex technical challenges"
    },
  ];

  const achievements = [
    { icon: Users, title: "50,000+", subtitle: "Farmers Reached", color: "text-blue-500" },
    { icon: MapPin, title: "15", subtitle: "States Covered", color: "text-green-500" },
    { icon: Calendar, title: "2024", subtitle: "Project Launch", color: "text-purple-500" },
    { icon: Award, title: "AI-Powered", subtitle: "Innovation", color: "text-orange-500" },
  ];

  const features = [
    "Real-time groundwater data access",
    "Multilingual support (Hindi, Telugu, English)",
    "Interactive maps and visualizations",
    "Simple voice and text queries",
    "Government scheme recommendations",
    "Crop planning assistance"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-secondary/10"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-accent font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Innovation
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                INGRES-AI
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
                Transforming Groundwater Data Access
              </p>
              <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                We're revolutionizing how farmers, policymakers, and communities access and understand 
                groundwater information through cutting-edge AI technology and multilingual support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4">
                  <Heart className="w-5 h-5 mr-2" />
                  Join Our Mission
                </Button>
                <Button variant="outline" size="lg" className="font-semibold px-8 py-4">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 px-4 bg-secondary/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center group hover-scale">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-background shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300`}>
                    <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">Why INGRES-AI Exists</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Understanding the challenges that drove us to create an innovative solution
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover-scale">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Challenge</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Groundwater data on the INGRES portal is locked away in complex technical interfaces. 
                    Farmers can't easily check if their area is safe for drilling, and policymakers spend 
                    hours navigating confusing databases.
                  </p>
                  <div className="text-sm text-red-600 font-medium">Critical Issue</div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover-scale">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-blue-500"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Transform groundwater data access through AI-powered conversations. Anyone should be able 
                    to ask questions in their local language and get clear, actionable answers about water resources.
                  </p>
                  <div className="text-sm text-accent font-medium">Innovation</div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover-scale">
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">The Impact</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Empowering farmers to make informed decisions, helping policymakers access data quickly, 
                    and making groundwater management transparent and accessible for everyone.
                  </p>
                  <div className="text-sm text-green-600 font-medium">Positive Change</div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="bg-gradient-to-br from-secondary/30 to-accent/5 rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-foreground mb-8 text-center">What Makes Us Different</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-20 px-4 bg-gradient-to-br from-secondary/20 to-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-accent font-medium mb-6">
                <Users className="w-4 h-4" />
                Dream Team
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                The Minds Behind INGRES-AI
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A diverse group of passionate individuals united by the mission to make groundwater data accessible to everyone
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden hover-scale">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-accent/10 to-secondary/20 p-8 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -translate-y-10 translate-x-10"></div>
                      <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-white text-xl font-bold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                      <p className="text-accent font-semibold mb-4">{member.role}</p>
                    </div>
                    <div className="p-6">
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {member.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex} 
                            className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mentors & Contributors */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full text-orange-600 font-medium mb-6">
                <Award className="w-4 h-4" />
                Our Guiding Stars
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Mentors & Contributors</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The wisdom and support that helped shape our vision into reality
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {mentors.map((mentor, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className={`h-32 bg-gradient-to-br ${mentor.color} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute bottom-4 left-6">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-white font-bold text-xl">{mentor.initials}</span>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          {index === 0 ? (
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Award className="w-4 h-4 text-yellow-800" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Heart className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-2">{mentor.name}</h3>
                        <p className="text-accent font-semibold mb-4">{mentor.role}</p>
                        <p className="text-muted-foreground leading-relaxed">
                          {mentor.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solution & Impact */}
        <section className="py-20 px-4 bg-gradient-to-br from-background via-secondary/10 to-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">Transforming Water Management</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                How we're making a real difference in communities across India
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Solution Side */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-accent font-medium mb-6">
                    <Lightbulb className="w-4 h-4" />
                    Our Technology
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    Intelligent Water Data Platform
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    Advanced AI technology that breaks down complex groundwater data into simple, 
                    actionable insights that anyone can understand and use.
                  </p>
                </div>

                <div className="grid gap-4">
                  {[
                    { icon: "🤖", title: "AI-Powered Conversations", desc: "Chat naturally in your preferred language" },
                    { icon: "🗺️", title: "Interactive Visualizations", desc: "See data through maps and charts" },
                    { icon: "⚡", title: "Real-Time Updates", desc: "Always access the latest information" },
                    { icon: "🌐", title: "Multi-Language Support", desc: "Hindi, Telugu, English, and more" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300">
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Side */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full text-green-600 font-medium mb-6">
                    <TrendingUp className="w-4 h-4" />
                    Real Impact
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-6">
                    Empowering Communities
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    Every interaction creates positive change, helping people make informed decisions 
                    about water resources and sustainable farming practices.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { 
                      title: "Farmers & Rural Communities", 
                      desc: "Get instant answers about water safety, drilling recommendations, and government schemes in local languages",
                      color: "from-green-500 to-emerald-500",
                      icon: "🌾"
                    },
                    { 
                      title: "Policymakers & Researchers", 
                      desc: "Access comprehensive data analysis, trends, and insights for evidence-based decision making",
                      color: "from-blue-500 to-cyan-500", 
                      icon: "📊"
                    },
                    { 
                      title: "General Public", 
                      desc: "Understand water resources in your area and learn about conservation practices",
                      color: "from-purple-500 to-pink-500",
                      icon: "👥"
                    }
                  ].map((impact, index) => (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0">
                      <CardContent className="p-0">
                        <div className={`h-2 bg-gradient-to-r ${impact.color}`}></div>
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="text-2xl">{impact.icon}</div>
                            <div>
                              <h4 className="text-lg font-bold text-foreground mb-2">{impact.title}</h4>
                              <p className="text-muted-foreground text-sm leading-relaxed">{impact.desc}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-accent/10 to-secondary/20 rounded-3xl p-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Join Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Help us make groundwater data accessible to everyone. Whether you're a farmer, researcher, 
                or simply someone who cares about water conservation, INGRES-AI is here for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4">
                  <Mail className="w-5 h-5 mr-2" />
                  Get in Touch
                </Button>
                <Button variant="outline" size="lg" className="font-semibold px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule a Demo
                </Button>
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