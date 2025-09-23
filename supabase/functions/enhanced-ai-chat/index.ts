import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callGeminiAPI(question: string) {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are INGRES-AI, a helpful assistant for groundwater management in India. Answer this question: ${question}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response.";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { message: question, userProfile } = await req.json();
    
    console.log('Processing chat request:', { question, userId: userProfile?.id });

    // 1️⃣ Search Supabase knowledge_base first
    const { data: kbResults, error } = await supabaseClient
      .from('knowledge_base')
      .select('*')
      .textSearch('content', question, { config: 'english' })
      .limit(5);

    if (error) {
      console.error('Knowledge base search error:', error);
    }

    console.log('Knowledge base results:', { 
      found: kbResults?.length || 0,
      hasContent: (kbResults && kbResults.length > 0)
    });

    let supabaseAnswer = "";
    if (kbResults && kbResults.length > 0) {
      supabaseAnswer = kbResults
        .map((row) => `${row.title}: ${row.content}`)
        .join('\n\n');
    }

    // 2️⃣ Fallback to Gemini if needed or supplement
    let geminiAnswer = "";
    const needsGeminiFallback = !supabaseAnswer || kbResults.length < 3;
    
    if (needsGeminiFallback) {
      console.log('Calling Gemini API for fallback/supplement');
      try {
        geminiAnswer = await callGeminiAPI(question);
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        geminiAnswer = "I'm having trouble accessing additional information right now.";
      }
    }

    // 3️⃣ Merge intelligently with clear source separation
    const responseParts = [];
    
    if (supabaseAnswer) {
      responseParts.push(`📚 **From INGRES Knowledge Base:**\n${supabaseAnswer}`);
    }
    
    if (geminiAnswer) {
      const geminiLabel = supabaseAnswer ? 
        "🤖 **Additional AI Insights:**" : 
        "🤖 **Gemini AI Response:**\n⚠️ *Note: This is general AI knowledge. For specific local data, please contact water authorities.*";
      responseParts.push(`${geminiLabel}\n${geminiAnswer}`);
    }

    const finalAnswer = responseParts.length > 0 ? 
      responseParts.join('\n\n---\n\n') : 
      "I couldn't find relevant information. Please try rephrasing your question or contact local water authorities.";

    // Store chat interaction for analytics
    await supabaseClient
      .from('user_documents')
      .insert({
        user_id: userProfile?.id || 'anonymous',
        title: `Chat: ${question.substring(0, 50)}...`,
        file_name: `chat_${Date.now()}.txt`,
        file_path: 'chat_logs',
        original_name: 'AI Chat Log',
        mime_type: 'text/plain',
        file_size: question.length + finalAnswer.length,
        category: 'chat_log',
        description: 'AI chat interaction',
        extracted_text: `User: ${question}\n\nAI: ${finalAnswer}`,
        is_local_only: true
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        response: finalAnswer,
        sources: {
          supabase_results: kbResults?.length || 0,
          used_gemini: needsGeminiFallback,
          primary_source: supabaseAnswer ? 'supabase' : 'gemini'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in enhanced AI chat:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request', 
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});