import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, TrendingDown, TrendingUp, AlertTriangle, MapPin, Calendar } from 'lucide-react';
import { mockApi, type GroundwaterStatus } from '@/lib/mockApi';

interface OverviewPanelProps {
  profile?: any;
  onSectionChange: (section: string) => void;
}

export const OverviewPanel = ({ profile, onSectionChange }: OverviewPanelProps) => {
  const [groundwaterData, setGroundwaterData] = useState<GroundwaterStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (profile?.state) {
        try {
          const data = await mockApi.getGroundwaterStatus(
            profile.state, 
            profile.district, 
            profile.city
          );
          setGroundwaterData(data);
        } catch (error) {
          console.error('Failed to load groundwater data:', error);
        }
      }
      setLoading(false);
    };
    
    loadData();
  }, [profile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'bg-green-500';
      case 'Semi-Critical': return 'bg-yellow-500';
      case 'Critical': return 'bg-orange-500';
      case 'Over-Exploited': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Safe': return 'default';
      case 'Semi-Critical': return 'secondary';
      case 'Critical': return 'destructive';
      case 'Over-Exploited': return 'destructive';
      default: return 'outline';
    }
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.name || 'friend';
    
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 18) return `Good afternoon, ${name}! 🌤️`;
    return `Good evening, ${name}! 🌙`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-primary">{getUserGreeting()}</h1>
        <p className="text-muted-foreground">
          {profile?.city && profile?.district && profile?.state
            ? `${profile.city}, ${profile.district}, ${profile.state}`
            : 'Welcome to your groundwater dashboard'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-scale cursor-pointer" onClick={() => onSectionChange('map')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Local Status</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {groundwaterData.length > 0 ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {groundwaterData[0].status}
                </div>
                <p className="text-xs text-muted-foreground">
                  {groundwaterData[0].extractionPercentage}% extraction
                </p>
                <Progress value={groundwaterData[0].extractionPercentage} className="h-2" />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Set your location to see local data
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer" onClick={() => onSectionChange('schemes')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Schemes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">3</div>
            <p className="text-xs text-muted-foreground">
              Active in your area
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer" onClick={() => onSectionChange('history')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Chats</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {JSON.parse(localStorage.getItem('ingres_chats') || '[]').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Conversations saved
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer" onClick={() => onSectionChange('helpline')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-destructive">24/7 Help</div>
            <p className="text-xs text-muted-foreground">
              Tap for assistance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Local Groundwater Status */}
      {groundwaterData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Local Groundwater Status
            </CardTitle>
            <CardDescription>
              Latest data from INGRES for your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groundwaterData.map((block) => (
                <div key={block.block} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{block.block}</div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date(block.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={getStatusVariant(block.status)}>
                      {block.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {block.extractionPercentage}% extracted
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={() => onSectionChange('map')} 
                variant="outline" 
                size="sm"
              >
                View on Map
              </Button>
              <Button 
                onClick={() => onSectionChange('chat')} 
                variant="outline" 
                size="sm"
              >
                Ask About This
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => onSectionChange('chat')}
              className="h-auto flex-col p-4 space-y-2"
            >
              <Droplets className="w-6 h-6 text-accent" />
              <span className="text-xs">Ask AI</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onSectionChange('schemes')}
              className="h-auto flex-col p-4 space-y-2"
            >
              <TrendingUp className="w-6 h-6 text-accent" />
              <span className="text-xs">Find Schemes</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onSectionChange('map')}
              className="h-auto flex-col p-4 space-y-2"
            >
              <MapPin className="w-6 h-6 text-accent" />
              <span className="text-xs">View Map</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => onSectionChange('budget')}
              className="h-auto flex-col p-4 space-y-2"
            >
              <Calendar className="w-6 h-6 text-accent" />
              <span className="text-xs">Budget Help</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};