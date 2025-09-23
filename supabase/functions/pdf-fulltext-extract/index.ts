import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.11.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { filePath, originalName, upsertToKnowledgeBase = true, language = 'english' } = await req.json();
    if (!filePath) {
      return new Response(JSON.stringify({ error: 'filePath is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Download file from storage
    const { data: downloaded, error: downloadError } = await supabase.storage.from('documents').download(filePath);
    if (downloadError || !downloaded) {
      throw new Error(`Failed to download file: ${downloadError?.message || 'unknown error'}`);
    }

    const uint8 = new Uint8Array(await downloaded.arrayBuffer());
    const pdf = await getDocumentProxy(uint8);
    const { text } = await extractText(pdf, { mergePages: true });

    // Optionally store full text into knowledge_base for search
    let kbId: string | null = null;
    if (upsertToKnowledgeBase) {
      const title = (originalName || filePath.split('/').pop() || 'PDF Document').replace(/\.pdf$/i, '');
      const { data: kbData, error: kbError } = await supabase
        .from('knowledge_base')
        .insert({
          title,
          content: text,
          category: 'pdf_fulltext',
          source_document: originalName || title + '.pdf',
          language,
          tags: ['pdf', 'fulltext']
        })
        .select('id')
        .maybeSingle();

      if (kbError) {
        console.error('KB insert error:', kbError);
      } else {
        kbId = kbData?.id || null;
      }
    }

    return new Response(
      JSON.stringify({ success: true, textLength: text.length, kbId, preview: text.slice(0, 500) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});