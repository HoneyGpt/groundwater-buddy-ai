import { useState, useEffect } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentGrid } from './DocumentGrid';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Search, Filter, Grid3X3, List, FolderOpen } from 'lucide-react';

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
}

import { getCurrentUserId } from '@/lib/userUtils';

export const DocumentSaverPanel = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  const categories = [
    'all',
    'ID Proofs',
    'Bills',
    'Schemes',
    'Health',
    'Education',
    'Legal',
    'Financial',
    'Other'
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

  const handleDocumentUploaded = (newDocument: Document) => {
    setDocuments(prev => [newDocument, ...prev]);
    setShowUpload(false);
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleDocumentUpdated = (updatedDocument: Document) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === updatedDocument.id ? updatedDocument : doc
    ));
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const documentStats = {
    total: documents.length,
    categories: categories.slice(1).reduce((acc, cat) => {
      acc[cat] = documents.filter(doc => doc.category === cat).length;
      return acc;
    }, {} as Record<string, number>)
  };

  if (showUpload) {
    return (
      <DocumentUpload 
        onDocumentUploaded={handleDocumentUploaded}
        onCancel={() => setShowUpload(false)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Saver</h1>
          <p className="text-muted-foreground">
            Securely store and manage your important documents
          </p>
        </div>
        <Button 
          onClick={() => setShowUpload(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{documentStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {documentStats.categories['ID Proofs'] || 0}
            </div>
            <div className="text-sm text-muted-foreground">ID Proofs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {documentStats.categories['Bills'] || 0}
            </div>
            <div className="text-sm text-muted-foreground">Bills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {documentStats.categories['Schemes'] || 0}
            </div>
            <div className="text-sm text-muted-foreground">Schemes</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documents or ask questions like 'show my Aadhaar card'"
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

      {/* Documents */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading documents...</div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {documents.length === 0 ? 'No documents yet' : 'No documents match your filters'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {documents.length === 0 
                ? 'Upload your first document to get started'
                : 'Try adjusting your search or category filter'
              }
            </p>
            {documents.length === 0 && (
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Document
              </Button>
            )}
          </Card>
        ) : (
          <DocumentGrid 
            documents={filteredDocuments}
            viewMode={viewMode}
            onDocumentDeleted={handleDocumentDeleted}
            onDocumentUpdated={handleDocumentUpdated}
          />
        )}
      </div>
    </div>
  );
};