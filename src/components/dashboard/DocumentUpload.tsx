import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Image, FileCheck, ArrowLeft } from 'lucide-react';

interface DocumentUploadProps {
  onDocumentUploaded: (document: any) => void;
  onCancel: () => void;
}

import { getCurrentUserId } from '@/lib/userUtils';

export const DocumentUpload = ({ onDocumentUploaded, onCancel }: DocumentUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    category: 'Other',
    tags: '',
    location: '',
    description: '',
    isLocalOnly: false
  });
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    
    // Auto-suggest category based on file name
    if (acceptedFiles.length > 0 && !metadata.title) {
      const fileName = acceptedFiles[0].name.toLowerCase();
      let suggestedCategory = 'Other';
      
      if (fileName.includes('aadhaar') || fileName.includes('pan') || fileName.includes('passport')) {
        suggestedCategory = 'ID Proofs';
      } else if (fileName.includes('bill') || fileName.includes('receipt')) {
        suggestedCategory = 'Bills';
      } else if (fileName.includes('scheme') || fileName.includes('subsidy')) {
        suggestedCategory = 'Schemes';
      } else if (fileName.includes('medical') || fileName.includes('health')) {
        suggestedCategory = 'Health';
      }
      
      setMetadata(prev => ({
        ...prev,
        title: acceptedFiles[0].name.split('.')[0],
        category: suggestedCategory
      }));
    }
  }, [metadata.title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimeType.includes('pdf')) return <FileText className="w-6 h-6" />;
    return <FileCheck className="w-6 h-6" />;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      let userId = getCurrentUserId();
      
      // If no profile exists, create a minimal one for document uploads
      if (!userId) {
        const guestProfile = {
          name: 'Guest User',
          age: '',
          country: 'India',
          state: '',
          district: '',
          city: '',
          allowLocation: false
        };
        localStorage.setItem('ingres_public_profile', JSON.stringify(guestProfile));
        userId = getCurrentUserId();
        
        toast({
          title: "Profile Created",
          description: "Created a guest profile for document uploads. You can update it later.",
        });
      }

      for (const file of files) {
        // Generate unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Extract text content if it's a text file or PDF via edge function
        let extractedText = '';
        if (file.type === 'text/plain') {
          extractedText = await file.text();
        } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          const { data: extractData, error: extractError } = await supabase.functions.invoke('pdf-fulltext-extract', {
            body: { filePath, originalName: file.name, upsertToKnowledgeBase: true }
          });
          if (extractError) {
            console.error('PDF extract error:', extractError);
          } else if (extractData?.success) {
            // We won't store the full text in UI state, but keep it in documents for search
            extractedText = extractData.preview ? String(extractData.preview) : '';
          }
        }

        // Insert document metadata into database
        const { data: documentData, error: dbError } = await supabase
          .from('user_documents')
          .insert({
            user_id: userId,
            file_name: fileName,
            original_name: file.name,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
            title: metadata.title || file.name.split('.')[0],
            tags: metadata.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            category: metadata.category,
            location: metadata.location,
            description: metadata.description,
            is_local_only: metadata.isLocalOnly,
            extracted_text: extractedText
          })
          .select()
          .single();

        if (dbError) throw dbError;

        onDocumentUploaded(documentData);
      }

      toast({
        title: "Success",
        description: `${files.length} document(s) uploaded successfully`,
      });

      // Reset form
      setFiles([]);
      setMetadata({
        title: '',
        category: 'Other', 
        tags: '',
        location: '',
        description: '',
        isLocalOnly: false
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Documents</h1>
          <p className="text-muted-foreground">
            Add your important documents securely
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Select Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                or click to browse
              </div>
              <div className="text-xs text-muted-foreground">
                Supports PDF, Word docs, images, text files (up to 50MB each)
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Document title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={metadata.category}
                onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
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
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={metadata.tags}
                onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="comma, separated, tags"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={metadata.location}
                onChange={(e) => setMetadata(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Where is this document from?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="local-only"
                checked={metadata.isLocalOnly}
                onCheckedChange={(checked) => setMetadata(prev => ({ ...prev, isLocalOnly: checked }))}
              />
              <Label htmlFor="local-only" className="text-sm">
                Store locally only (more secure for sensitive documents)
              </Label>
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={uploading || files.length === 0}
              className="w-full"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Document(s)`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};