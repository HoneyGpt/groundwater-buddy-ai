import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, Settings } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { HistoryPanel } from '@/components/dashboard/HistoryPanel';
import { DocumentSaverPanel } from '@/components/dashboard/DocumentSaverPanel';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  
  // Water points gamification
  const [waterPoints, setWaterPoints] = useState(() => {
    return parseInt(localStorage.getItem('ingres_water_points') || '0');
  });

  // Load profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('ingres_public_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Redirect to profile setup if no profile exists
      navigate('/profile-setup');
    }
  }, [navigate]);

  const addWaterPoints = (points: number) => {
    const newTotal = waterPoints + points;
    setWaterPoints(newTotal);
    localStorage.setItem('ingres_water_points', newTotal.toString());
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    
    // Award water points for exploration (only once per section per day)
    const today = new Date().toDateString();
    const visitedKey = `visited_${section}_${today}`;
    if (!localStorage.getItem(visitedKey)) {
      addWaterPoints(10); // 10 points per new section per day
      localStorage.setItem(visitedKey, 'true');
    }
  };

  const handleLoadChat = (chat: any) => {
    setChatMessages(chat.messages);
  };

  const getUserInitials = () => {
    const name = profile?.name || 'Guest';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!profile) {
    return <div className="min-h-screen bg-gradient-to-br from-water-50 to-accent/10 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading your profile...</p>
      </div>
    </div>;
  }

  const renderMainContent = () => {
    switch (activeSection) {
      case 'chat':
        return <ChatPanel profile={profile} />;
      case 'history':
        return <HistoryPanel onLoadChat={handleLoadChat} onSectionChange={handleSectionChange} />;
      case 'documents':
        return <DocumentSaverPanel />;
      case 'overview':
      default:
        return <OverviewPanel profile={profile} onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-50 to-accent/10 flex flex-col">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">I</span>
                </div>
                <h1 className="text-xl font-bold text-primary">INGRES-AI Public</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Water Points */}
              <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
                <span className="text-accent text-sm font-medium">💧 {waterPoints}</span>
              </div>
              
              {/* Profile */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">
                  {profile.name || 'Guest'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <div className={`hidden md:block transition-all duration-300 ${mobileMenuOpen ? 'block' : ''}`}>
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNavigateHome={() => navigate('/')}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
            <div className="w-64">
              <DashboardSidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                onNavigateHome={() => navigate('/')}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;