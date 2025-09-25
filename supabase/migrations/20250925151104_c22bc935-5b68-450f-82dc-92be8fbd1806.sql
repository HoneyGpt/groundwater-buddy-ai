-- Fix critical security vulnerability in user_documents table RLS policies
-- Replace the unsafe 'true' conditions with proper user authentication checks

-- Drop existing unsafe policies
DROP POLICY IF EXISTS "Public users can view their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Public users can create their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Public users can update their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Public users can delete their own documents" ON public.user_documents;

-- Create secure RLS policies that properly filter by authenticated user
CREATE POLICY "Users can view only their own documents" 
ON public.user_documents 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" 
ON public.user_documents 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own documents" 
ON public.user_documents 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete only their own documents" 
ON public.user_documents 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Also ensure the user_id column cannot be null to prevent security bypasses
ALTER TABLE public.user_documents ALTER COLUMN user_id SET NOT NULL;