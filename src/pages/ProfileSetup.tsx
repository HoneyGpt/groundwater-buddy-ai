import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MapPin, User, Heart, ChevronLeft } from 'lucide-react';
import { mockApi } from '@/lib/mockApi';

interface ProfileData {
  name: string;
  age: string;
  country: string;
  state: string;
  district: string;
  city: string;
  allowLocation: boolean;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    age: '',
    country: 'India',
    state: '',
    district: '',
    city: '',
    allowLocation: false
  });

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      const stateData = await mockApi.getStates();
      setStates(stateData);
    };
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (profile.state) {
      const loadDistricts = async () => {
        const districtData = await mockApi.getDistricts(profile.state);
        setDistricts(districtData);
        setProfile(prev => ({ ...prev, district: '', city: '' }));
      };
      loadDistricts();
    }
  }, [profile.state]);

  // Handle geolocation
  const handleLocationToggle = async (enabled: boolean) => {
    setProfile(prev => ({ ...prev, allowLocation: enabled }));
    
    if (enabled) {
      setGeoLoading(true);
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });

        const { latitude, longitude } = position.coords;
        const locationData = await mockApi.reverseGeocode(latitude, longitude);
        
        setProfile(prev => ({
          ...prev,
          state: locationData.state,
          district: locationData.district,
          city: locationData.city
        }));

        toast({
          title: "Location detected!",
          description: `Found: ${locationData.city}, ${locationData.district}, ${locationData.state}`,
        });
      } catch (error) {
        toast({
          title: "Location access denied",
          description: "Please select your location manually or allow location access.",
          variant: "destructive"
        });
        setProfile(prev => ({ ...prev, allowLocation: false }));
      } finally {
        setGeoLoading(false);
      }
    }
  };

  const validateForm = () => {
    if (profile.age && (isNaN(Number(profile.age)) || Number(profile.age) < 1 || Number(profile.age) > 120)) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age between 1 and 120.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    
    if (!profile.state) {
      toast({
        title: "State required",
        description: "Please choose a state or skip for now.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Save profile to localStorage
    localStorage.setItem('ingres_public_profile', JSON.stringify(profile));
    
    // Show welcome toast
    const welcomeName = profile.name || 'Friend';
    toast({
      title: `Welcome, ${welcomeName}! 💛`,
      description: "Loading your local dashboard...",
    });

    // Navigate to dashboard
    setTimeout(() => {
      navigate('/public-dashboard');
    }, 1000);
  };

  const handleSkip = () => {
    // Save minimal profile
    const minimalProfile = { ...profile, name: 'Guest' };
    localStorage.setItem('ingres_public_profile', JSON.stringify(minimalProfile));
    
    toast({
      title: "Welcome! 🌊",
      description: "You can always set up your profile later.",
    });
    
    navigate('/public-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 to-accent/10 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              onClick={() => navigate('/mediator')}
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-accent" />
              <span className="text-lg font-semibold text-primary">INGRES-AI</span>
            </div>
            <div className="w-16" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl border-0 bg-background/95 backdrop-blur-sm animate-fade-in">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-2xl text-primary mb-2">
              Tell us about you 💛
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Fill a little info to get personalised local updates — or skip and continue.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name (optional)
              </Label>
              <Input
                id="name"
                placeholder="Harshu / Nickname"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="border-border/50 focus:border-accent"
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to personalize your experience
              </p>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Age (optional)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                min="1"
                max="120"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                className="border-border/50 focus:border-accent"
              />
              <p className="text-xs text-muted-foreground">
                Helps us show age-appropriate schemes and tips
              </p>
            </div>

            {/* Location Permission */}
            <div className="space-y-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <Label htmlFor="location" className="text-sm font-medium">
                    Use my location for local alerts
                  </Label>
                </div>
                <Switch
                  id="location"
                  checked={profile.allowLocation}
                  onCheckedChange={handleLocationToggle}
                  disabled={geoLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {geoLoading 
                  ? "Detecting your location..."
                  : "Get personalized groundwater alerts and schemes for your area"
                }
              </p>
            </div>

            {/* Country (locked) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Country</Label>
              <Input value="India" disabled className="bg-muted" />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                State <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={profile.state} 
                onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}
              >
                <SelectTrigger className="border-border/50 focus:border-accent">
                  <SelectValue placeholder="Choose your state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Required to show local groundwater data and schemes
              </p>
            </div>

            {/* District */}
            {profile.state && (
              <div className="space-y-2 animate-fade-in">
                <Label className="text-sm font-medium">District</Label>
                <Select 
                  value={profile.district} 
                  onValueChange={(value) => setProfile(prev => ({ ...prev, district: value }))}
                >
                  <SelectTrigger className="border-border/50 focus:border-accent">
                    <SelectValue placeholder="Choose your district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* City/Taluk/Block */}
            {profile.district && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="city" className="text-sm font-medium">
                  City / Taluk / Block
                </Label>
                <Input
                  id="city"
                  placeholder="Enter your city or block"
                  value={profile.city}
                  onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                  className="border-border/50 focus:border-accent"
                />
                <p className="text-xs text-muted-foreground">
                  More specific location for better local information
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleContinue}
                disabled={loading}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-base font-medium"
              >
                Continue as Public
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                disabled={loading}
                className="flex-1 h-12 text-base border-border/50 hover:bg-muted"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;