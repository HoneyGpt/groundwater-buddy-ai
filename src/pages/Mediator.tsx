import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Mediator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-water-50 to-accent-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-12">
          {/* Greeting Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <Bot className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-primary">
                Who are you? 🌟
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                Choose your access level to get personalized groundwater insights
              </p>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-lg mx-auto">
            {/* Public Button */}
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/public-dashboard')}
                className="w-full h-32 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-yellow-300"
                size="lg"
              >
                <div className="flex flex-col items-center space-y-3">
                  <Users className="w-8 h-8" />
                  <span className="text-xl font-bold">Public</span>
                </div>
              </Button>
              <p className="text-sm text-muted-foreground">
                Open access for farmers, citizens, and students
              </p>
            </div>

            {/* Official Button */}
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/official-login')}
                className="w-full h-32 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-border"
                size="lg"
              >
                <div className="flex flex-col items-center space-y-3">
                  <ShieldCheck className="w-8 h-8" />
                  <span className="text-xl font-bold">Official</span>
                </div>
              </Button>
              <p className="text-sm text-muted-foreground">
                Advanced features for policymakers and researchers
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-primary">Public:</span> Free access to groundwater data, simple explanations, and basic guidance. Perfect for everyday users! 🌊<br/>
              <span className="font-semibold text-primary">Official:</span> Advanced analytics, detailed reports, and policy-grade insights. Login required for verified users.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Mediator;