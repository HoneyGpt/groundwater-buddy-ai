import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callGeminiAPI(question: string, conversationHistory: string = "") {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const systemPrompt = `You are INGRES-AI, a specialized assistant for groundwater management in India. 

RESPONSE FORMAT REQUIREMENTS:
• Use emojis and clear section headers
• Structure responses with bullet points and numbered lists
• Keep paragraphs concise and well-formatted
• Use markdown-style formatting for better readability
• Include practical actionable advice
• Reference specific Indian government schemes when relevant

EXAMPLE FORMAT:
💧 **Groundwater Status Analysis**

**Current Situation:**
• Key finding 1
• Key finding 2

**📊 Why This Matters:**
• Impact point 1 with specific data
• Impact point 2 with context

**⚡ Recommended Actions:**
1. Immediate step with specific guidance
2. Long-term strategy with implementation details

${conversationHistory ? `\nCONVERSATION CONTEXT:\n${conversationHistory}\n` : ""}

Question: ${question}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1500,
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

    const { message: question, userProfile, conversationHistory } = await req.json();
    
    console.log('Processing chat request:', { question, userId: userProfile?.id });

    // Get recent conversation context for memory
    const contextHistory = conversationHistory ? 
      conversationHistory.slice(-6).map((msg: any) => 
        `${msg.isUser ? 'User' : 'INGRES-AI'}: ${msg.text}`
      ).join('\n') : "";

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
      // Format knowledge base results better
      supabaseAnswer = `📚 **INGRES Knowledge Base**\n\n${kbResults
        .map((row, idx) => `**${idx + 1}. ${row.title}**\n${row.content}`)
        .join('\n\n')}`;
    }

    // 2️⃣ Get structured AI response with conversation memory
    let geminiAnswer = "";
    console.log('Calling Gemini API with context');
    try {
      geminiAnswer = await callGeminiAPI(question, contextHistory);
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      geminiAnswer = "🌊 I'm experiencing technical difficulties but remain ready to help with groundwater queries. Please try again!";
    }

    // 3️⃣ Combine responses with better formatting
    let finalAnswer = "";
    
    if (supabaseAnswer && geminiAnswer) {
      finalAnswer = `${supabaseAnswer}\n\n---\n\n🤖 **INGRES-AI Analysis**\n${geminiAnswer}`;
    } else if (supabaseAnswer) {
      finalAnswer = `${supabaseAnswer}\n\n🤖 **Additional Context**\nFor more specific guidance, please provide your location details or specific requirements.`;
    } else if (geminiAnswer) {
      finalAnswer = geminiAnswer;
    } else {
      finalAnswer = "🌊 **INGRES-AI Response**\n\nI couldn't find specific information about your query. Please try:\n• Being more specific about your location\n• Asking about government schemes\n• Requesting water conservation tips\n• Checking groundwater levels in your area";
    }

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
          used_gemini: !!geminiAnswer,
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
        details: (error as Error).message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});