import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OfficialLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    departmentId: '',
    name: ''
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/playground');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/playground');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Login successful!",
          description: "Welcome to the official dashboard.",
        });
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/official-login`,
            data: {
              department_id: formData.departmentId,
              name: formData.name,
              user_type: 'official'
            }
          }
        });

        if (error) throw error;

        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account before logging in.",
        });
        setIsLogin(true); // Switch to login mode
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-1"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-foreground">Official Email</label>
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.name@gov.in"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="mt-1 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {!isLogin && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Department ID</label>
                    <Input 
                      type="text"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      placeholder="DEPT-12345"
                      className="mt-1"
                      required={!isLogin}
                    />
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In to Official Dashboard' : 'Create Official Account'
                  )}
                </Button>
              </form>

              <div className="text-center space-y-2">
                {isLogin ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Don't have official access?
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      variant="link"
                      className="text-accent hover:text-accent/80 p-0 h-auto"
                    >
                      Create Official Account
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Already have an account?
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      variant="link"
                      className="text-accent hover:text-accent/80 p-0 h-auto"
                    >
                      Sign In Instead
                    </Button>
                  </>
                )}
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