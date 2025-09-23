import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Calendar as CalendarIcon, FileText, Calculator, AlertCircle, Bell } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  category: 'reminder' | 'alert' | 'budget' | 'document' | 'scheme';
  isImportant?: boolean;
}

const categoryConfig = {
  reminder: { color: 'bg-accent', icon: Bell, label: 'Reminder' },
  alert: { color: 'bg-destructive', icon: AlertCircle, label: 'Alert' },
  budget: { color: 'bg-water', icon: Calculator, label: 'Budget' },
  document: { color: 'bg-primary', icon: FileText, label: 'Document' },
  scheme: { color: 'bg-secondary', icon: CalendarIcon, label: 'Scheme' }
};

// Pre-populated important dates
const importantDates: CalendarEvent[] = [
  {
    id: 'scheme-1',
    title: 'National Water Mission Scheme',
    description: 'Application deadline for groundwater recharge schemes',
    date: new Date(2025, 0, 15), // Jan 15, 2025  
    category: 'scheme',
    isImportant: true
  },
  {
    id: 'alert-1',
    title: 'Monsoon Water Audit',
    description: 'Local water quality assessment scheduled',
    date: new Date(2025, 5, 1), // Jun 1, 2025
    category: 'alert',
    isImportant: true
  },
  {
    id: 'scheme-2',
    title: 'PMKSY Application Opens',
    description: 'Pradhan Mantri Krishi Sinchayee Yojana applications open',
    date: new Date(2025, 2, 10), // Mar 10, 2025
    category: 'scheme',
    isImportant: true
  }
];

export const CalendarPanel = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'reminder' as CalendarEvent['category']
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('ingres_calendar_events');
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: parseISO(event.date)
      }));
      setEvents([...importantDates, ...parsed]);
    } else {
      setEvents(importantDates);
    }
  }, []);

  // Save events to localStorage
  const saveEvents = (newEvents: CalendarEvent[]) => {
    const userEvents = newEvents.filter(event => !event.isImportant);
    const eventsToSave = userEvents.map(event => ({
      ...event,
      date: event.date.toISOString()
    }));
    localStorage.setItem('ingres_calendar_events', JSON.stringify(eventsToSave));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate,
      category: newEvent.category
    };

    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);

    setNewEvent({ title: '', description: '', category: 'reminder' });
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Get dates with events for highlighting
  const getDatesWithEvents = () => {
    return events.map(event => event.date);
  };

  const getDatesWithImportantEvents = () => {
    return events.filter(event => event.isImportant).map(event => event.date);
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Calendar</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <Select value={newEvent.category} onValueChange={(value: any) => setNewEvent({ ...newEvent, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <config.icon className="w-4 h-4" />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddEvent} className="w-full">
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                hasEvents: getDatesWithEvents(),
                hasImportantEvents: getDatesWithImportantEvents()
              }}
              modifiersStyles={{
                hasEvents: { 
                  backgroundColor: 'hsl(var(--accent))', 
                  color: 'hsl(var(--accent-foreground))',
                  fontWeight: 'bold'
                },
                hasImportantEvents: { 
                  backgroundColor: 'hsl(var(--destructive))', 
                  color: 'hsl(var(--destructive-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => {
                    const config = categoryConfig[event.category];
                    const Icon = config.icon;
                    
                    return (
                      <div key={event.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 flex-1">
                            <Icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${config.color} text-white`}
                                >
                                  {config.label}
                                </Badge>
                                {event.isImportant && (
                                  <Badge variant="destructive" className="text-xs">
                                    Important
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {!event.isImportant && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events on this date</p>
                  <p className="text-xs mt-1">Click "Add Event" to create one</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Event Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{config.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};