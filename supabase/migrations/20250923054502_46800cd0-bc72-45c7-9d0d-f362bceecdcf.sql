-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'documents', 
  'documents', 
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp', 'text/plain']
);

-- Create documents table
CREATE TABLE public.user_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  title TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  location TEXT,
  description TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_local_only BOOLEAN DEFAULT false,
  extracted_text TEXT,
  ai_summary TEXT
);

-- Enable RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for user documents
CREATE POLICY "Users can view their own documents" 
ON public.user_documents 
FOR SELECT 
USING (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Users can create their own documents" 
ON public.user_documents 
FOR INSERT 
WITH CHECK (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own documents" 
ON public.user_documents 
FOR UPDATE 
USING (user_id::text = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete their own documents" 
ON public.user_documents 
FOR DELETE 
USING (user_id::text = auth.jwt() ->> 'sub');

-- Create storage policies for document uploads
CREATE POLICY "Users can view their own documents in storage" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.jwt() ->> 'sub' = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.jwt() ->> 'sub' = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents in storage" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND auth.jwt() ->> 'sub' = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents in storage" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND auth.jwt() ->> 'sub' = (storage.foldername(name))[1]);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_documents_updated_at
BEFORE UPDATE ON public.user_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_user_documents_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX idx_user_documents_category ON public.user_documents(category);
CREATE INDEX idx_user_documents_tags ON public.user_documents USING GIN(tags);
CREATE INDEX idx_user_documents_text_search ON public.user_documents USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(extracted_text, '')));