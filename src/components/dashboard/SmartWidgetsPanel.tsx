import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Layout,
  Plus,
  Settings,
  MessageSquare,
  Upload,
  FileText,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Download,
  Brain,
  Lightbulb,
  RefreshCw,
  Eye,
  Grip,
  X
} from 'lucide-react';

interface Widget {
  id: string;
  type: 'quick-actions' | 'recent-activity' | 'ai-suggestions' | 'stats' | 'weather' | 'notifications';
  title: string;
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  data?: any;
}

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  color: string;
}

interface RecentActivity {
  id: string;
  type: 'chat' | 'upload' | 'export' | 'analysis';
  title: string;
  timestamp: string;
  icon: any;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export const SmartWidgetsPanel = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [customizeDialog, setCustomizeDialog] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [quickActions] = useState<QuickAction[]>([
    {
      id: '1',
      label: 'Upload Document',
      icon: Upload,
      action: () => console.log('Upload'),
      color: 'bg-blue-500'
    },
    {
      id: '2',
      label: 'Start Chat',
      icon: MessageSquare,
      action: () => console.log('Chat'),
      color: 'bg-green-500'
    },
    {
      id: '3',
      label: 'Export Data',
      icon: Download,
      action: () => console.log('Export'),
      color: 'bg-purple-500'
    },
    {
      id: '4',
      label: 'AI Analysis',
      icon: Brain,
      action: () => console.log('Analysis'),
      color: 'bg-orange-500'
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'chat',
      title: 'Chat about groundwater in Telangana',
      timestamp: '2 hours ago',
      icon: MessageSquare
    },
    {
      id: '2',
      type: 'upload',
      title: 'Uploaded research paper on water conservation',
      timestamp: '4 hours ago',
      icon: Upload
    },
    {
      id: '3',
      type: 'export',
      title: 'Exported chat conversation to PDF',
      timestamp: '1 day ago',
      icon: Download
    },
    {
      id: '4',
      type: 'analysis',
      title: 'AI analysis of 3 documents completed',
      timestamp: '2 days ago',
      icon: Brain
    }
  ]);

  const [aiSuggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      title: 'Compare Recent Documents',
      description: 'Would you like me to compare your last two uploaded PDFs?',
      action: 'compare-docs',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Update Analysis',
      description: 'New groundwater data available for your region',
      action: 'update-analysis',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Export Summary',
      description: 'Create a summary report of this week\'s activities',
      action: 'create-summary',
      priority: 'low'
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    // Initialize default widgets
    const defaultWidgets: Widget[] = [
      {
        id: '1',
        type: 'quick-actions',
        title: 'Quick Actions',
        enabled: true,
        position: 0,
        size: 'medium'
      },
      {
        id: '2',
        type: 'recent-activity',
        title: 'Recent Activity',
        enabled: true,
        position: 1,
        size: 'medium'
      },
      {
        id: '3',
        type: 'ai-suggestions',
        title: 'AI Suggestions',
        enabled: true,
        position: 2,
        size: 'large'
      },
      {
        id: '4',
        type: 'stats',
        title: 'Statistics',
        enabled: true,
        position: 3,
        size: 'small'
      },
      {
        id: '5',
        type: 'notifications',
        title: 'Notifications',
        enabled: false,
        position: 4,
        size: 'medium'
      }
    ];

    setWidgets(defaultWidgets);
  }, []);

  const handleToggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    ));
  };

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    if (!draggedWidget) return;
    
    const draggedWidgetData = widgets.find(w => w.id === draggedWidget);
    if (!draggedWidgetData) return;

    setWidgets(prev => {
      // Remove dragged widget and adjust positions
      const withoutDragged = prev.filter(w => w.id !== draggedWidget)
        .map((w, index) => ({ ...w, position: index }));
      
      // Insert at new position
      const result = [...withoutDragged];
      result.splice(targetPosition, 0, { ...draggedWidgetData, position: targetPosition });
      
      // Reorder positions
      return result.map((w, index) => ({ ...w, position: index }));
    });

    setDraggedWidget(null);
    toast({
      title: "Widget Moved",
      description: "Widget position updated successfully",
    });
  };

  const renderWidget = (widget: Widget) => {
    if (!widget.enabled) return null;

    const getWidgetSize = (size: string) => {
      switch (size) {
        case 'small': return 'col-span-1';
        case 'medium': return 'col-span-2';
        case 'large': return 'col-span-3';
        default: return 'col-span-2';
      }
    };

    const baseClass = `${getWidgetSize(widget.size)} transition-all duration-200 hover:shadow-lg`;

    switch (widget.type) {
      case 'quick-actions':
        return (
          <Card 
            key={widget.id} 
            className={baseClass}
            draggable
            onDragStart={() => handleDragStart(widget.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, widget.position)}
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Layout className="w-4 h-4 mr-2" />
                {widget.title}
              </CardTitle>
              <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map(action => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={action.action}
                  >
                    <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'recent-activity':
        return (
          <Card 
            key={widget.id} 
            className={baseClass}
            draggable
            onDragStart={() => handleDragStart(widget.id)}
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {widget.title}
              </CardTitle>
              <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        );

      case 'ai-suggestions':
        return (
          <Card 
            key={widget.id} 
            className={baseClass}
            draggable
            onDragStart={() => handleDragStart(widget.id)}
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                {widget.title}
              </CardTitle>
              <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <Badge 
                        variant={suggestion.priority === 'high' ? 'destructive' : 
                                suggestion.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Take Action
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'stats':
        return (
          <Card 
            key={widget.id} 
            className={baseClass}
            draggable
            onDragStart={() => handleDragStart(widget.id)}
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                {widget.title}
              </CardTitle>
              <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">156</div>
                  <div className="text-xs text-muted-foreground">Chats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">8</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'notifications':
        return (
          <Card 
            key={widget.id} 
            className={baseClass}
            draggable
            onDragStart={() => handleDragStart(widget.id)}
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {widget.title}
              </CardTitle>
              <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground">
                <p className="text-sm">No new notifications</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const enabledWidgets = widgets.filter(w => w.enabled).sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Layout className="w-6 h-6 mr-2 text-primary" />
            Smart Dashboard
          </h1>
          <p className="text-muted-foreground">
            Customizable widgets for enhanced productivity
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setCustomizeDialog(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
          {enabledWidgets.map(widget => renderWidget(widget))}
        </div>

        {enabledWidgets.length === 0 && (
          <Card className="p-8 text-center">
            <Layout className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Widgets Enabled</h3>
            <p className="text-muted-foreground mb-4">
              Customize your dashboard by enabling widgets
            </p>
            <Button onClick={() => setCustomizeDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Widgets
            </Button>
          </Card>
        )}
      </div>

      {/* Customize Dialog */}
      <Dialog open={customizeDialog} onOpenChange={setCustomizeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Customize Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable or disable widgets to customize your dashboard experience
            </p>
            
            <div className="space-y-3">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{widget.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {widget.type === 'quick-actions' && 'Quick access to common actions'}
                      {widget.type === 'recent-activity' && 'Your recent activities and interactions'}
                      {widget.type === 'ai-suggestions' && 'AI-powered suggestions and recommendations'}
                      {widget.type === 'stats' && 'Key statistics and metrics'}
                      {widget.type === 'notifications' && 'Important notifications and alerts'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground capitalize">{widget.size}</span>
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={() => handleToggleWidget(widget.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setCustomizeDialog(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};