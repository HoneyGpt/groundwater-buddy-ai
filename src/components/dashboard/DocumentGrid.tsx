import { useState } from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentEditDialog } from './DocumentEditDialog';

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

interface DocumentGridProps {
  documents: Document[];
  viewMode: 'grid' | 'list';
  onDocumentDeleted: (documentId: string) => void;
  onDocumentUpdated: (document: Document) => void;
}

export const DocumentGrid = ({
  documents,
  viewMode,
  onDocumentDeleted,
  onDocumentUpdated
}: DocumentGridProps) => {
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
  };

  const handleEditClose = () => {
    setEditingDocument(null);
  };

  const handleDocumentUpdated = (updatedDocument: Document) => {
    onDocumentUpdated(updatedDocument);
    setEditingDocument(null);
  };

  if (viewMode === 'grid') {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onEdit={() => handleEdit(document)}
              onDelete={() => onDocumentDeleted(document.id)}
              viewMode="grid"
            />
          ))}
        </div>
        
        {editingDocument && (
          <DocumentEditDialog
            document={editingDocument}
            open={!!editingDocument}
            onClose={handleEditClose}
            onDocumentUpdated={handleDocumentUpdated}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onEdit={() => handleEdit(document)}
            onDelete={() => onDocumentDeleted(document.id)}
            viewMode="list"
          />
        ))}
      </div>
      
      {editingDocument && (
        <DocumentEditDialog
          document={editingDocument}
          open={!!editingDocument}
          onClose={handleEditClose}
          onDocumentUpdated={handleDocumentUpdated}
        />
      )}
    </>
  );
};