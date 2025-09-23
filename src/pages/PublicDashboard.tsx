import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Settings } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { HistoryPanel } from '@/components/dashboard/HistoryPanel';
import { DocumentSaverPanel } from '@/components/dashboard/DocumentSaverPanel';
import { KnowledgeIngestionButton } from '@/components/KnowledgeIngestionButton';
import BudgetBroPanel from '@/components/dashboard/BudgetBroPanel';
import { MapsPanel } from '@/components/dashboard/MapsPanel';
import { CalendarPanel } from '@/components/dashboard/CalendarPanel';
import HelplinePanel from '@/components/dashboard/HelplinePanel';

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isManualToggle, setIsManualToggle] = useState(false);
  
  // Water points gamification
  const [waterPoints, setWaterPoints] = useState(() => {
    return parseInt(localStorage.getItem('ingres_water_points') || '0');
  });

  // Scroll management refs
  const lastScrollRef = useRef<number>(window.scrollY);
  const tickingRef = useRef(false);

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

  // Handle scroll behavior for sidebar (debounced with hysteresis)
  useEffect(() => {
    const THRESHOLD = 16; // pixels
    const handleScroll = () => {
      if (isManualToggle) return; // Don't auto-collapse if user manually toggled or after nav

      const current = window.scrollY;
      const last = lastScrollRef.current;
      const delta = current - last;

      if (Math.abs(delta) < THRESHOLD) return; // ignore micro scrolls
      if (tickingRef.current) return; // throttle to next frame
      tickingRef.current = true;

      requestAnimationFrame(() => {
        if (current > 120 && delta > 0) {
          setScrollDirection('down');
          setSidebarCollapsed((prev) => (prev ? prev : true));
        } else if (delta < 0) {
          setScrollDirection('up');
          setSidebarCollapsed((prev) => (prev ? false : prev));
        }
        lastScrollRef.current = current;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isManualToggle]);

  // Reset manual toggle after a period of inactivity
  useEffect(() => {
    if (isManualToggle) {
      const timer = setTimeout(() => {
        setIsManualToggle(false);
      }, 1200); // Reset shortly after manual interaction/navigation
      
      return () => clearTimeout(timer);
    }
  }, [isManualToggle]);

  const addWaterPoints = (points: number) => {
    const newTotal = waterPoints + points;
    setWaterPoints(newTotal);
    localStorage.setItem('ingres_water_points', newTotal.toString());
  };

  const handleSectionChange = (section: string) => {
    setIsManualToggle(true); // temporarily suppress auto-collapse while navigating
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
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <KnowledgeIngestionButton />
            </div>
            <ChatPanel profile={profile} />
          </div>
        );
      case 'history':
        return <HistoryPanel onLoadChat={handleLoadChat} onSectionChange={handleSectionChange} />;
      case 'documents':
        return <DocumentSaverPanel />;
      case 'budget':
        return <BudgetBroPanel profile={profile} />;
      case 'maps':
        return <MapsPanel />;
      case 'calendar':
        return <CalendarPanel />;
      case 'helpline':
        return <HelplinePanel />;
      case 'overview':
      default:
        return <OverviewPanel profile={profile} onSectionChange={handleSectionChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex">
      {/* Sidebar */}
      <div className={`hidden md:block transition-all duration-500 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } sticky top-0 h-screen`}>
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => {
            setIsManualToggle(true);
            setSidebarCollapsed(!sidebarCollapsed);
          }}
          onNavigateHome={() => navigate('/')}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="w-64 h-full">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  variant="ghost"
                  size="sm"
                  className="md:hidden hover:bg-primary/10"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">I</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      INGRES-AI
                    </h1>
                    <p className="text-xs text-muted-foreground">Groundwater Intelligence</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Water Points */}
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-4 py-2 rounded-full border border-blue-200/20">
                  <span className="text-blue-600 font-semibold">💧 {waterPoints}</span>
                </div>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{profile.name || 'Guest'}</p>
                    <p className="text-xs text-muted-foreground">{profile.location || 'India'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

    </div>
  );
};

export default PublicDashboard;