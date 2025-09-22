import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OfficialLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-water-50 to-accent-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border-border">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Official Access</CardTitle>
              <CardDescription className="text-base">
                Advanced features for policymakers, researchers, and verified officials
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Official Email</label>
                  <Input 
                    type="email" 
                    placeholder="your.name@gov.in"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Department ID</label>
                  <Input 
                    type="text" 
                    placeholder="DEPT-12345"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In to Official Dashboard
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don't have official access?
                </p>
                <Button
                  variant="link"
                  className="text-accent hover:text-accent/80 p-0 h-auto"
                >
                  Request Access
                </Button>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  onClick={() => navigate('/mediator')}
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Access Selection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-background/60 backdrop-blur-sm border-accent/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-primary">Official Features Include:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Advanced data analytics and reports</li>
                  <li>• Policy-grade insights and recommendations</li>
                  <li>• Export capabilities for official use</li>
                  <li>• Priority support and consultations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfficialLogin;