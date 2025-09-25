import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Save, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  profile: any;
  onProfileUpdate: (newProfile: any) => void;
}

export const SettingsPanel = ({ profile, onProfileUpdate }: SettingsPanelProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile?.name || '');

  const handleSave = () => {
    const updatedProfile = { ...profile, name: editedName };
    localStorage.setItem('ingres_public_profile', JSON.stringify(updatedProfile));
    onProfileUpdate(updatedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your name has been successfully updated.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('ingres_public_profile');
    localStorage.removeItem('ingres_water_points');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
            <CardDescription>
              Update your name and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                disabled={!isEditing}
                className={isEditing ? "border-primary/50" : ""}
              />
            </div>

            <Separator />

            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Name
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(profile?.name || '');
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contact & Support</span>
            </CardTitle>
            <CardDescription>
              Get in touch with our team for help and support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <div>
                  <p className="font-medium">General Support</p>
                  <p className="text-sm text-muted-foreground">For general inquiries and support</p>
                </div>
                <a 
                  href="mailto:support@ingres-ai.com" 
                  className="text-primary hover:text-primary/80 font-medium text-sm"
                >
                  support@ingres-ai.com
                </a>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <div>
                  <p className="font-medium">Technical Support</p>
                  <p className="text-sm text-muted-foreground">For technical issues and bugs</p>
                </div>
                <a 
                  href="mailto:tech@ingres-ai.com" 
                  className="text-primary hover:text-primary/80 font-medium text-sm"
                >
                  tech@ingres-ai.com
                </a>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                <div>
                  <p className="font-medium">Research Partnerships</p>
                  <p className="text-sm text-muted-foreground">For academic collaborations</p>
                </div>
                <a 
                  href="mailto:research@ingres-ai.com" 
                  className="text-primary hover:text-primary/80 font-medium text-sm"
                >
                  research@ingres-ai.com
                </a>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Need immediate assistance? Our team typically responds within 24 hours.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@ingres-ai.com?subject=INGRES-AI Support Request">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Support Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Account Actions</span>
            </CardTitle>
            <CardDescription>
              Manage your session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex-1 sm:flex-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Logging out will clear your session and you'll need to set up your profile again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};