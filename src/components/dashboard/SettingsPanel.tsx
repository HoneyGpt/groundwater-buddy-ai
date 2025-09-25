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
              <div className="flex flex-col space-y-2 p-3 bg-accent/5 rounded-lg">
                <div>
                  <p className="font-medium">Team Support</p>
                  <p className="text-sm text-muted-foreground">Contact our development team for support</p>
                </div>
                <div className="space-y-1">
                  <a 
                    href="mailto:harshitabhaskaruni@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium text-xs block"
                  >
                    harshitabhaskaruni@gmail.com
                  </a>
                  <a 
                    href="mailto:tinkuganesh15@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium text-xs block"
                  >
                    tinkuganesh15@gmail.com
                  </a>
                  <a 
                    href="mailto:anchaljaiswal.1001@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium text-xs block"
                  >
                    anchaljaiswal.1001@gmail.com
                  </a>
                  <a 
                    href="mailto:kishlayamishra@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium text-xs block"
                  >
                    kishlayamishra@gmail.com
                  </a>
                  <a 
                    href="mailto:isauravsharmaokay4359@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium text-xs block"
                  >
                    isauravsharmaokay4359@gmail.com
                  </a>
                  <a 
                    href="mailto:minusonebroking@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium text-xs block"
                  >
                    minusonebroking@gmail.com
                  </a>
                  <div className="mt-2 pt-2 border-t border-accent/20">
                    <a 
                      href="https://www.linkedin.com/in/vivek-u-5619a125b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-medium text-xs block"
                    >
                      💼 Vivek U - LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Need immediate assistance? Our team typically responds within 24 hours.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:harshitabhaskaruni@gmail.com?subject=INGRES-AI Support Request">
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

        {/* Appreciation & Support */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>❤️</span>
              <span>Appreciation & Support</span>
            </CardTitle>
            <CardDescription>
              Show appreciation and support to our app development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
              <div className="flex-1">
                <p className="font-medium text-primary">Saurav Sharma</p>
                <p className="text-sm text-muted-foreground mb-2">Lead Developer & Project Coordinator</p>
                <p className="text-xs text-muted-foreground">Connect with our lead developer for appreciation and support</p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:isauravsharmaokay4359@gmail.com" className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://www.linkedin.com/in/saurav-sharma-1b7321247?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <span className="w-3 h-3 mr-1">💼</span>
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};