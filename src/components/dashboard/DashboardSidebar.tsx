import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  FileText, 
  Calculator, 
  Calendar, 
  Map, 
  Gift, 
  Phone, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigateHome: () => void;
  onNavigateToDashboard: () => void;
}

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'history', label: 'History', icon: History },
  { id: 'documents', label: 'Document Saver', icon: FileText },
  { id: 'budget', label: 'Budget Bro', icon: Calculator },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'maps', label: 'Interactive Maps', icon: Map },
  { id: 'schemes', label: 'Schemes', icon: Gift },
  { id: 'helpline', label: 'Helpline', icon: Phone },
];

export const DashboardSidebar = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse,
  onNavigateHome,
  onNavigateToDashboard
}: SidebarProps) => {
  return (
    <div className={`bg-gradient-to-b from-primary/5 to-accent/5 border-r border-primary/10 transition-all duration-500 ease-in-out h-full ${
      isCollapsed ? 'w-16' : 'w-64'
    } shadow-lg`}>
      {/* Header */}
      <div className="p-4 border-b border-primary/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex gap-2">
              <Button
                onClick={onNavigateToDashboard}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-accent hover:bg-primary/10 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={onNavigateHome}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-accent hover:bg-primary/10 transition-all duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          )}
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-accent hover:bg-primary/10 ml-auto rounded-full transition-all duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-12 transition-all duration-200 ${
                  isCollapsed ? 'px-3' : 'px-4'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg' 
                    : 'text-foreground hover:text-primary hover:bg-primary/10'
                } rounded-xl`}
                onClick={() => onSectionChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0 ${
                  isActive ? 'text-white' : ''
                }`} />
                {!isCollapsed && (
                  <span className={`truncate font-medium ${
                    isActive ? 'text-white' : ''
                  }`}>
                    {item.label}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};