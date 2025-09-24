import { useState, useEffect } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  FolderOpen,
  Eye,
  Sparkles,
  Pin,
  Download,
  FileText,
  Bot,
  Lightbulb,
  Crosshair
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: string;
  tags: string[];
  location: string;
  description: string;
  upload_date: string;
  is_local_only: boolean;
  ai_summary: string;
  extracted_text: string;
  pinned?: boolean;
}

import { getCurrentUserId } from '@/lib/userUtils';

export const EnhancedDocumentPanel = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [aiSummaryDialog, setAiSummaryDialog] = useState(false);
  const [crossAnalysisDialog, setCrossAnalysisDialog] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const { toast } = useToast();

  const categories = [
    'all', 'Research Papers', 'Government Reports', 'Datasets', 
    'Technical Documents', 'Legal Documents', 'Studies', 'Other'
  ];

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handlePinDocument = async (docId: string) => {
    try {
      // Note: pinned functionality would need database schema update
      const { error } = await supabase
        .from('user_documents')
        .update({ description: 'pinned' })
        .eq('id', docId);

      if (error) throw error;
      
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, pinned: true } : doc
      ));
      
      toast({ title: "Document pinned successfully" });
    } catch (error) {
      toast({ title: "Error pinning document", variant: "destructive" });
    }
  };

  const handleAISummarize = async (document: Document) => {
    setSelectedDocument(document);
    setAiSummaryDialog(true);
    setLoadingAI(true);

    try {
      const { data, error } = await supabase.functions.invoke('enhanced-ai-chat', {
        body: {
          question: `Please provide a comprehensive summary of this document: "${document.title}". Content: ${document.extracted_text?.slice(0, 2000)}`,
          userProfile: { type: 'official' }
        }
      });

      if (error) throw error;
      setAiInsights(data.answer);
    } catch (error) {
      toast({ title: "Error generating summary", variant: "destructive" });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCrossAnalysis = async () => {
    if (selectedDocuments.length < 2) {
      toast({ title: "Select at least 2 documents for cross-analysis", variant: "destructive" });
      return;
    }

    setCrossAnalysisDialog(true);
    setLoadingAI(true);

    try {
      const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
      const combinedContent = selectedDocs.map(doc => 
        `Document: ${doc.title}\nContent: ${doc.extracted_text?.slice(0, 1000)}`
      ).join('\n\n---\n\n');

      const { data, error } = await supabase.functions.invoke('enhanced-ai-chat', {
        body: {
          question: `Please perform a cross-analysis of these ${selectedDocs.length} documents. Find common insights, contradictions, and key findings: ${combinedContent}`,
          userProfile: { type: 'official' }
        }
      });

      if (error) throw error;
      setAiInsights(data.answer);
    } catch (error) {
      toast({ title: "Error performing cross-analysis", variant: "destructive" });
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.ai_summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Sort with pinned documents first
  const sortedDocuments = filteredDocuments.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const documentStats = {
    total: documents.length,
    pinned: documents.filter(doc => doc.pinned).length,
    categories: categories.slice(1).reduce((acc, cat) => {
      acc[cat] = documents.filter(doc => doc.category === cat).length;
      return acc;
    }, {} as Record<string, number>)
  };

  if (showUpload) {
    return (
      <DocumentUpload 
        onDocumentUploaded={(doc) => {
          setDocuments(prev => [doc, ...prev]);
          setShowUpload(false);
        }}
        onCancel={() => setShowUpload(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary" />
            Enhanced Document Center
          </h1>
          <p className="text-muted-foreground">
            AI-powered document management with research capabilities
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
          <Button 
            onClick={handleCrossAnalysis}
            variant="outline"
            disabled={selectedDocuments.length < 2}
          >
            <Bot className="w-4 h-4 mr-2" />
            Cross-Analyze ({selectedDocuments.length})
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{documentStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{documentStats.pinned}</div>
            <div className="text-sm text-muted-foreground">Pinned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {documentStats.categories['Research Papers'] || 0}
            </div>
            <div className="text-sm text-muted-foreground">Research</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {documentStats.categories['Datasets'] || 0}
            </div>
            <div className="text-sm text-muted-foreground">Datasets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {documentStats.categories['Government Reports'] || 0}
            </div>
            <div className="text-sm text-muted-foreground">Reports</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documents, ask AI questions, or find insights..."
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <div className="flex border border-input rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none border-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none border-0 border-l border-input"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading documents...</div>
          </div>
        ) : sortedDocuments.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              Upload research papers, datasets, or reports to get started
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Document
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {sortedDocuments.map((doc) => (
              <Card key={doc.id} className={`hover:shadow-md transition-shadow ${doc.pinned ? 'ring-2 ring-primary/20' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base line-clamp-2 flex items-center">
                        {doc.pinned && <Pin className="w-4 h-4 mr-1 text-primary" />}
                        {doc.title || doc.original_name}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {doc.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(doc.upload_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments(prev => [...prev, doc.id]);
                        } else {
                          setSelectedDocuments(prev => prev.filter(id => id !== doc.id));
                        }
                      }}
                      className="ml-2"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {doc.ai_summary && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {doc.ai_summary}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDocument(doc);
                        setPreviewDialog(true);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAISummarize(doc)}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Summary
                    </Button>
                    {!doc.pinned && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePinDocument(doc.id)}
                      >
                        <Pin className="w-3 h-3 mr-1" />
                        Pin
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title || selectedDocument?.original_name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Document Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Category:</strong> {selectedDocument?.category}</p>
                  <p><strong>Size:</strong> {((selectedDocument?.file_size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Upload Date:</strong> {new Date(selectedDocument?.upload_date || '').toLocaleDateString()}</p>
                </div>
              </div>
              {selectedDocument?.extracted_text && (
                <div>
                  <h4 className="font-semibold mb-2">Extracted Content</h4>
                  <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {selectedDocument.extracted_text.slice(0, 3000)}
                    {selectedDocument.extracted_text.length > 3000 && '...'}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* AI Summary Dialog */}
      <Dialog open={aiSummaryDialog} onOpenChange={setAiSummaryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              AI Summary - {selectedDocument?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[50vh] p-4">
            {loadingAI ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm">{aiInsights}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Cross Analysis Dialog */}
      <Dialog open={crossAnalysisDialog} onOpenChange={setCrossAnalysisDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Crosshair className="w-5 h-5 mr-2" />
              Cross-Analysis Results
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] p-4">
            {loadingAI ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm">{aiInsights}</div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};