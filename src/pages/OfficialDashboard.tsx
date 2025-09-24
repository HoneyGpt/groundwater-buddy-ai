import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Bell, Settings, LogOut, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { ChatPanel } from '@/components/dashboard/ChatPanel';
import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { HistoryPanel } from '@/components/dashboard/HistoryPanel';
import { EnhancedDocumentPanel } from '@/components/dashboard/EnhancedDocumentPanel';
import { ChatExportPanel } from '@/components/dashboard/ChatExportPanel';
import { AIResearchPanel } from '@/components/dashboard/AIResearchPanel';
import { SmartWidgetsPanel } from '@/components/dashboard/SmartWidgetsPanel';
import BudgetBroPanel from '@/components/dashboard/BudgetBroPanel';
import { MapsPanel } from '@/components/dashboard/MapsPanel';
import { CalendarPanel } from '@/components/dashboard/CalendarPanel';
import HelplinePanel from '@/components/dashboard/HelplinePanel';

const OfficialDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!currentSession) {
          navigate('/official-login');
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);
      } catch (error: any) {
        console.error('Auth error:', error);
        navigate('/official-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/official-login');
      } else {
        setSession(session);
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your official account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const handleLoadChat = (chat: any) => {
    setChatMessages(chat.messages);
  };

  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email || 'Official';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserProfile = () => {
    return {
      name: user?.user_metadata?.name || 'Official User',
      email: user?.email || '',
      department_id: user?.user_metadata?.department_id || '',
      location: 'India',
      type: 'official'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your official dashboard...</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    const profile = getUserProfile();
    
    switch (activeSection) {
      case 'chat':
        return <ChatPanel profile={profile} />;
      case 'history':
        return <HistoryPanel onLoadChat={handleLoadChat} onSectionChange={handleSectionChange} />;
      case 'documents':
        return <EnhancedDocumentPanel />;
      case 'export':
        return <ChatExportPanel />;
      case 'research':
        return <AIResearchPanel />;
      case 'widgets':
        return <SmartWidgetsPanel />;
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
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
                      INGRES-AI Official
                    </h1>
                    <p className="text-xs text-muted-foreground">Government Dashboard</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Official Badge */}
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Official
                </Badge>
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
                
                {/* Profile */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{getUserProfile().name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.user_metadata?.department_id || 'Official User'}
                    </p>
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

export default OfficialDashboard;