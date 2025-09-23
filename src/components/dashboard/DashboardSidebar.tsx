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
  Home
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigateHome: () => void;
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
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const DashboardSidebar = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse,
  onNavigateHome 
}: SidebarProps) => {
  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Button
              onClick={onNavigateHome}
              variant="ghost"
              size="sm"
              className="text-sidebar-foreground hover:text-sidebar-primary"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          )}
          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground hover:text-sidebar-primary ml-auto"
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
        <div className="p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 h-10 ${
                  isCollapsed ? 'px-2' : 'px-3'
                } ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50'
                }`}
                onClick={() => onSectionChange(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};