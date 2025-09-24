import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  FileText, 
  MessageSquare, 
  Calendar,
  Search,
  Filter,
  ExternalLink,
  FileDown
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  message_count: number;
  messages: ChatMessage[];
  category: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ChatExportPanel = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [exportDialog, setExportDialog] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'markdown'>('pdf');
  const [exportTitle, setExportTitle] = useState('');
  const [exportNotes, setExportNotes] = useState('');
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const categories = ['all', 'Research', 'Analysis', 'Planning', 'Reports', 'Other'];

  // Mock chat sessions - replace with actual data from your backend
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Groundwater Analysis for Telangana',
        created_at: new Date().toISOString(),
        message_count: 15,
        category: 'Analysis',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'What is the current groundwater status in Telangana?',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            role: 'assistant',
            content: 'Based on the latest INGRES data, Telangana shows varying groundwater levels across districts...',
            timestamp: new Date().toISOString()
          }
        ]
      },
      {
        id: '2',
        title: 'Water Conservation Strategies',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        message_count: 8,
        category: 'Planning',
        messages: [
          {
            id: '3',
            role: 'user',
            content: 'Suggest water conservation methods for drought-prone areas',
            timestamp: new Date().toISOString()
          }
        ]
      }
    ];
    
    setChatSessions(mockSessions);
    setLoading(false);
  }, []);

  const handleExportChat = (chat: ChatSession) => {
    setSelectedChat(chat);
    setExportTitle(chat.title);
    setExportDialog(true);
  };

  const generateExport = async () => {
    if (!selectedChat) return;
    
    setExporting(true);
    
    try {
      const exportData = {
        title: exportTitle || selectedChat.title,
        notes: exportNotes,
        chat: selectedChat,
        format: exportFormat,
        exportedAt: new Date().toISOString(),
        exportedBy: 'Official User' // Replace with actual user
      };

      // Generate the export content based on format
      let content = '';
      
      if (exportFormat === 'markdown') {
        content = generateMarkdownExport(exportData);
        downloadFile(content, `${exportTitle}.md`, 'text/markdown');
      } else if (exportFormat === 'pdf') {
        content = generateHTMLForPDF(exportData);
        // In a real implementation, you'd use a PDF generation library
        downloadFile(content, `${exportTitle}.html`, 'text/html');
        toast({
          title: "Export Ready",
          description: "HTML version generated. Use browser's print to PDF for final PDF.",
        });
      } else {
        // For DOCX, you'd use a library like docx
        content = generateMarkdownExport(exportData);
        downloadFile(content, `${exportTitle}.txt`, 'text/plain');
      }

      toast({
        title: "Export Successful",
        description: `Chat exported as ${exportFormat.toUpperCase()}`,
      });
      
      setExportDialog(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const generateMarkdownExport = (data: any) => {
    const { title, notes, chat, exportedAt, exportedBy } = data;
    
    let markdown = `# ${title}\n\n`;
    markdown += `**Exported:** ${new Date(exportedAt).toLocaleString()}\n`;
    markdown += `**Exported by:** ${exportedBy}\n`;
    markdown += `**Original Chat Date:** ${new Date(chat.created_at).toLocaleString()}\n`;
    markdown += `**Category:** ${chat.category}\n\n`;
    
    if (notes) {
      markdown += `## Notes\n\n${notes}\n\n`;
    }
    
    markdown += `## Chat Conversation\n\n`;
    
    chat.messages.forEach((message: any, index: number) => {
      const role = message.role === 'user' ? '**User**' : '**AI Assistant**';
      const timestamp = new Date(message.timestamp).toLocaleString();
      
      markdown += `### ${role} - ${timestamp}\n\n`;
      markdown += `${message.content}\n\n---\n\n`;
    });
    
    markdown += `*End of conversation*\n`;
    markdown += `*Generated by INGRES-AI Official Dashboard*\n`;
    
    return markdown;
  };

  const generateHTMLForPDF = (data: any) => {
    const { title, notes, chat, exportedAt, exportedBy } = data;
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .message { margin-bottom: 20px; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
        .user-message { border-left-color: #28a745; }
        .assistant-message { border-left-color: #007bff; }
        .timestamp { color: #666; font-size: 0.9em; }
        .role { font-weight: bold; color: #333; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p><strong>Exported:</strong> ${new Date(exportedAt).toLocaleString()}</p>
        <p><strong>Exported by:</strong> ${exportedBy}</p>
        <p><strong>Original Chat Date:</strong> ${new Date(chat.created_at).toLocaleString()}</p>
        <p><strong>Category:</strong> ${chat.category}</p>
      </div>
    `;
    
    if (notes) {
      html += `<div><h2>Notes</h2><p>${notes.replace(/\n/g, '<br>')}</p></div>`;
    }
    
    html += `<h2>Chat Conversation</h2>`;
    
    chat.messages.forEach((message: any) => {
      const roleClass = message.role === 'user' ? 'user-message' : 'assistant-message';
      const roleText = message.role === 'user' ? 'User' : 'AI Assistant';
      
      html += `
        <div class="message ${roleClass}">
          <div class="role">${roleText}</div>
          <div class="timestamp">${new Date(message.timestamp).toLocaleString()}</div>
          <div class="content">${message.content.replace(/\n/g, '<br>')}</div>
        </div>
      `;
    });
    
    html += `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
        <p><em>Generated by INGRES-AI Official Dashboard</em></p>
      </div>
    </body>
    </html>
    `;
    
    return html;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredSessions = chatSessions.filter(session => {
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      session.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <FileDown className="w-6 h-6 mr-2 text-primary" />
            Chat Export Center
          </h1>
          <p className="text-muted-foreground">
            Download and export your chat conversations in various formats
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{chatSessions.length}</div>
            <div className="text-sm text-muted-foreground">Total Chats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {chatSessions.reduce((sum, chat) => sum + chat.message_count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {chatSessions.filter(chat => chat.category === 'Analysis').length}
            </div>
            <div className="text-sm text-muted-foreground">Analysis Chats</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {chatSessions.filter(chat => chat.category === 'Research').length}
            </div>
            <div className="text-sm text-muted-foreground">Research Chats</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search chat sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading chat sessions...</div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No chat sessions found</h3>
            <p className="text-muted-foreground">
              Start chatting to create exportable conversations
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                        {session.title}
                      </CardTitle>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {session.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {session.message_count} messages
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleExportChat(session)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialog} onOpenChange={setExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Export Chat - {selectedChat?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Export Title</label>
              <Input
                value={exportTitle}
                onChange={(e) => setExportTitle(e.target.value)}
                placeholder="Enter custom title for export"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF (via HTML)</SelectItem>
                  <SelectItem value="docx">Word Document (Text)</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea
                value={exportNotes}
                onChange={(e) => setExportNotes(e.target.value)}
                placeholder="Add any notes or context for this export..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setExportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={generateExport} disabled={exporting}>
                {exporting ? 'Exporting...' : 'Export Chat'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};