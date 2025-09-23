import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Image, 
  Download, 
  Edit, 
  Trash2, 
  MoreVertical,
  Eye,
  Calendar,
  Tag,
  MapPin,
  Lock,
  FileCheck
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
}

interface DocumentCardProps {
  document: Document;
  onEdit: () => void;
  onDelete: () => void;
  viewMode: 'grid' | 'list';
}

export const DocumentCard = ({ document, onEdit, onDelete, viewMode }: DocumentCardProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const getFileIcon = () => {
    if (document.mime_type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    if (document.mime_type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <FileCheck className="w-8 h-8 text-green-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.original_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      onDelete();
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {getFileIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {document.title || document.original_name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {document.original_name}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(document.upload_date)}
                    </span>
                    <span>{formatFileSize(document.file_size)}</span>
                    {document.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {document.location}
                      </span>
                    )}
                    {document.is_local_only && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <Lock className="w-3 h-3" />
                        Local Only
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {document.category}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDownload} disabled={downloading}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {document.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{document.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {getFileIcon()}
          </div>
          <div className="flex items-center gap-1">
            {document.is_local_only && (
              <Lock className="w-4 h-4 text-orange-600" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownload} disabled={downloading}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground text-sm line-clamp-2">
              {document.title || document.original_name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {document.original_name}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatFileSize(document.file_size)}</span>
            <span>{formatDate(document.upload_date)}</span>
          </div>

          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {document.category}
            </Badge>
            
            {document.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{document.location}</span>
              </div>
            )}

            {document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {document.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {document.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{document.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {document.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {document.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};