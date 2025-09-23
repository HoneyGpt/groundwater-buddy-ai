import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const KnowledgeIngestionButton = () => {
  const { toast } = useToast();
  const [isIngesting, setIsIngesting] = useState(false);
  const [isIngested, setIsIngested] = useState(false);

  const handleIngestPDFs = async () => {
    setIsIngesting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('pdf-knowledge-ingestion', {
        body: { action: 'ingest' }
      });

      if (error) throw error;

      if (data?.success) {
        setIsIngested(true);
        toast({
          title: "Knowledge Base Updated! 📚",
          description: `Successfully ingested ${data.stats?.knowledge_entries || 0} knowledge entries, ${data.stats?.government_schemes || 0} schemes, and ${data.stats?.conservation_tips || 0} tips.`,
        });
      } else {
        throw new Error(data?.error || 'Failed to ingest knowledge');
      }
    } catch (error) {
      console.error('Error ingesting PDFs:', error);
      toast({
        title: "Ingestion Failed",
        description: "Failed to update knowledge base. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          PDF Knowledge Ingestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Ingest the uploaded PDF documents into the AI knowledge base for enhanced responses about groundwater data, government schemes, and conservation tips.
        </p>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleIngestPDFs}
            disabled={isIngesting || isIngested}
            className="flex-1"
          >
            {isIngesting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Ingesting...
              </>
            ) : isIngested ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Ingested
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Ingest PDFs
              </>
            )}
          </Button>
          
          {isIngested && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {isIngested && (
          <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
            ✅ Knowledge base updated! The AI can now answer questions using data from all uploaded PDFs.
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>Note:</strong> This will populate the database with structured data from the PDFs including:
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Groundwater statistics and assessments</li>
            <li>Government schemes and eligibility criteria</li>
            <li>Water conservation techniques and tips</li>
            <li>Institutional frameworks and contact information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};