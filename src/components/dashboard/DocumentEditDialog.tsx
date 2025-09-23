import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

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

interface DocumentEditDialogProps {
  document: Document;
  open: boolean;
  onClose: () => void;
  onDocumentUpdated: (document: Document) => void;
}

export const DocumentEditDialog = ({ 
  document, 
  open, 
  onClose, 
  onDocumentUpdated 
}: DocumentEditDialogProps) => {
  const [formData, setFormData] = useState({
    title: document.title || document.original_name,
    category: document.category,
    tags: document.tags.join(', '),
    location: document.location || '',
    description: document.description || '',
    is_local_only: document.is_local_only
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const categories = [
    'ID Proofs',
    'Bills',
    'Schemes', 
    'Health',
    'Education',
    'Legal',
    'Financial',
    'Other'
  ];

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('user_documents')
        .update({
          title: formData.title,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          location: formData.location,
          description: formData.description,
          is_local_only: formData.is_local_only
        })
        .eq('id', document.id)
        .select()
        .single();

      if (error) throw error;

      onDocumentUpdated(data);
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSuggestedTag = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: currentTags.length > 0 ? `${formData.tags}, ${tag}` : tag
      }));
    }
  };

  const suggestedTags = {
    'ID Proofs': ['aadhaar', 'pan', 'passport', 'license', 'voter-id'],
    'Bills': ['electricity', 'water', 'phone', 'internet', 'gas'],
    'Schemes': ['subsidy', 'loan', 'benefit', 'welfare', 'government'],
    'Health': ['medical', 'prescription', 'report', 'insurance'],
    'Education': ['certificate', 'degree', 'transcript', 'marksheet'],
    'Legal': ['agreement', 'contract', 'legal', 'court', 'property'],
    'Financial': ['bank', 'statement', 'invoice', 'receipt', 'tax'],
    'Other': ['personal', 'miscellaneous', 'document']
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Document title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <select
              id="edit-category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="comma, separated, tags"
            />
            
            {/* Suggested Tags */}
            {suggestedTags[formData.category as keyof typeof suggestedTags] && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Suggested tags:</div>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags[formData.category as keyof typeof suggestedTags].map(tag => (
                    <Badge 
                      key={tag}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 text-xs"
                      onClick={() => addSuggestedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Where is this document from?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the document"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="edit-local-only"
              checked={formData.is_local_only}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_local_only: checked }))}
            />
            <Label htmlFor="edit-local-only" className="text-sm">
              Store locally only (more secure)
            </Label>
          </div>

          {/* Document Info */}
          <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
            <div className="font-medium">Document Info</div>
            <div className="space-y-1 text-muted-foreground">
              <div>Original Name: {document.original_name}</div>
              <div>Size: {(document.file_size / 1024 / 1024).toFixed(2)} MB</div>
              <div>Type: {document.mime_type}</div>
              <div>Uploaded: {new Date(document.upload_date).toLocaleDateString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};