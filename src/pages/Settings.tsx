import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Bell, Palette, Shield, Save, RotateCcw, Camera, Crown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileStorage, getCurrentContext, type UserContext } from '@/lib/storageUtils';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
  'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Mewat', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  // Add more states as needed
};

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Context-aware state management
  const [userContext, setUserContext] = useState<UserContext>('public');
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [profileType, setProfileType] = useState<'public' | 'professional'>('public');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  
  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [aiResponseStyle, setAiResponseStyle] = useState<'friendly' | 'professional'>('friendly');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  
  // Load profile data with context awareness
  useEffect(() => {
    const context = getCurrentContext();
    setUserContext(context);
    
    const savedProfile = ProfileStorage.get(context);
    if (savedProfile) {
      setProfile(savedProfile);
      setName(savedProfile.name || '');
      setProfileType(savedProfile.profileType || (context === 'official' ? 'professional' : 'public'));
      setCompany(savedProfile.company || '');
      setRole(savedProfile.role || '');
      setBio(savedProfile.bio || '');
      setState(savedProfile.state || '');
      setDistrict(savedProfile.district || '');
      setCity(savedProfile.city || savedProfile.location || '');
      setNotifications(savedProfile.notifications !== false);
      setAiResponseStyle(savedProfile.aiResponseStyle || (context === 'official' ? 'professional' : 'friendly'));
      setTheme(savedProfile.theme || 'auto');
    }
  }, []);

  const handleStateChange = (newState: string) => {
    setState(newState);
    setDistrict(''); // Reset district when state changes
  };

  const handleSaveSettings = () => {
    const updatedProfile = {
      ...profile,
      name,
      profileType,
      company: profileType === 'professional' ? company : '',
      role: profileType === 'professional' ? role : '',
      bio: profileType === 'professional' ? bio : '',
      state,
      district,
      location: city,
      city,
      notifications,
      aiResponseStyle,
      theme,
      updatedAt: new Date().toISOString()
    };

    ProfileStorage.set(updatedProfile, userContext);
    setProfile(updatedProfile);
    
    const contextName = userContext === 'official' ? 'Playground' : 'Public Dashboard';
    toast({
      title: "Settings Saved!",
      description: `Hey ${name}, your ${contextName} profile has been updated successfully.`,
    });
  };

  const handleResetDefaults = () => {
    setNotifications(true);
    setAiResponseStyle('friendly');
    setTheme('auto');
    
    toast({
      title: "Defaults Restored",
      description: "All preferences have been reset to default values.",
    });
  };

  const getUserInitials = () => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(userContext === 'official' ? '/playground' : '/public-dashboard')}
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {userContext === 'official' ? 'Playground' : 'Dashboard'}
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold">I</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Settings
                  </h1>
                  {userContext === 'official' && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      <Crown className="w-3 h-3 mr-1" />
                      Official
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Customize your {userContext === 'official' ? 'INGRES-AI Playground' : 'INGRES-AI'} experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Profile Info Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Profile Information</CardTitle>
            </div>
            <CardDescription>Manage your personal details and profile type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Profile Picture & Basic Info */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="profileType" className="text-sm font-medium">Profile Type</Label>
                  <Select value={profileType} onValueChange={(value: 'public' | 'professional') => setProfileType(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center space-x-2">
                          <span>🌱</span>
                          <span>Public User</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="professional">
                        <div className="flex items-center space-x-2">
                          <span>🏢</span>
                          <span>Professional</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Fields */}
            {profileType === 'professional' && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-accent/20">
                <h4 className="font-medium text-sm text-primary">Professional Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company/Institution</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your organization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role/Position</Label>
                    <Input
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Your job title"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Input
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description of your work"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Location</CardTitle>
            </div>
            <CardDescription>Your location helps provide relevant water data and schemes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value="India"
                  disabled
                  className="bg-muted/50"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((stateName) => (
                      <SelectItem key={stateName} value={stateName}>
                        {stateName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Select value={district} onValueChange={setDistrict} disabled={!state}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {state && DISTRICTS_BY_STATE[state]?.map((districtName) => (
                      <SelectItem key={districtName} value={districtName}>
                        {districtName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="city">City/Village</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city or village"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Preferences</CardTitle>
            </div>
            <CardDescription>Customize your app experience and AI responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-primary" />
                <div>
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get alerts about water levels and schemes</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            {/* AI Response Style */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">AI Response Style</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    aiResponseStyle === 'friendly' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setAiResponseStyle('friendly')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🌟</span>
                    <span className="font-medium">Friendly & Casual</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    "Hey there! Let me help you with groundwater info for your area."
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    aiResponseStyle === 'professional' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => setAiResponseStyle('professional')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🏢</span>
                    <span className="font-medium">Professional</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    "I can provide groundwater assessment data for your location."
                  </p>
                </div>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Theme Preference</Label>
              <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">☀️ Light Mode</SelectItem>
                  <SelectItem value="dark">🌙 Dark Mode</SelectItem>
                  <SelectItem value="auto">🔄 Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Security & Data</CardTitle>
            </div>
            <CardDescription>Manage your data and export options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col items-start">
                <div className="font-medium">Export Chat History</div>
                <div className="text-xs text-muted-foreground">Download all your conversations</div>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col items-start">
                <div className="font-medium">Export Documents</div>
                <div className="text-xs text-muted-foreground">Download saved documents</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            variant="outline"
            onClick={handleResetDefaults}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-primary to-accent text-white flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        </div>

        {/* AI Hint Box */}
        {profileType === 'professional' && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Professional Mode Activated!
              </p>
              <p className="text-xs text-blue-700 mt-1">
                AI responses will now use professional tone and include technical details suitable for water management professionals.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;