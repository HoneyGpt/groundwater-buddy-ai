import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced system prompt that leverages the knowledge base
const ENHANCED_SYSTEM_PROMPT = `You are INGRES-AI, a multilingual AI assistant for groundwater management in India. You help farmers, citizens, researchers, and policymakers with:

1. Groundwater status queries (extraction levels, quality, trends)
2. Government scheme recommendations (eligibility, application process)
3. Water conservation tips (practical, location-specific advice)
4. Policy and institutional information

RESPONSE GUIDELINES:
- Keep responses concise for public users, detailed for experts
- Always provide actionable next steps
- Include source citations when using database information
- Support English, Hindi, and Telugu (adapt language to user preference)
- For scheme queries, include eligibility and application links
- For groundwater status, provide current data with interpretation

RESPONSE FORMAT:
- Short answer (2-3 sentences)
- Significance/Impact (1 sentence) 
- Concrete action steps (numbered list)
- Relevant schemes/resources (if applicable)
- Source citation

Example: "Block X: Semi-Critical (stage 65%). This means moderate stress on groundwater resources. Steps: 1) Reduce extraction by 20%, 2) Implement rainwater harvesting, 3) Apply for [Scheme Name] - eligibility: [criteria]. Source: CGWB Assessment 2024"`;

async function searchKnowledgeBase(supabase: any, query: string, limit = 5) {
  // Search across knowledge base using full-text search
  const { data: kbResults } = await supabase
    .from('knowledge_base')
    .select('*')
    .textSearch('search_vector', query, { type: 'websearch' })
    .limit(limit);

  // Search government schemes
  const { data: schemeResults } = await supabase
    .from('government_schemes')
    .select('*')
    .textSearch('search_vector', query, { type: 'websearch' })
    .eq('is_active', true)
    .limit(3);

  // Search conservation tips
  const { data: tipResults } = await supabase
    .from('conservation_tips')
    .select('*')
    .textSearch('search_vector', query, { type: 'websearch' })
    .limit(3);

  return {
    knowledge: kbResults || [],
    schemes: schemeResults || [],
    tips: tipResults || []
  };
}

async function getLocationSpecificData(supabase: any, location: string) {
  // Get water insights for specific location
  const { data: insights } = await supabase
    .from('water_resources_insights')
    .select('*')
    .ilike('location_name', `%${location}%`)
    .limit(5);

  return insights || [];
}

function buildContextFromResults(searchResults: any, locationData: any) {
  let context = "RELEVANT INFORMATION FROM DATABASE:\n\n";
  
  // Add knowledge base context
  if (searchResults.knowledge.length > 0) {
    context += "KNOWLEDGE BASE:\n";
    searchResults.knowledge.forEach((item: any, i: number) => {
      context += `${i + 1}. ${item.title}: ${item.content}\n`;
      context += `   Source: ${item.source_document}\n\n`;
    });
  }

  // Add scheme information
  if (searchResults.schemes.length > 0) {
    context += "RELEVANT GOVERNMENT SCHEMES:\n";
    searchResults.schemes.forEach((scheme: any, i: number) => {
      context += `${i + 1}. ${scheme.scheme_name} (${scheme.ministry})\n`;
      context += `   Description: ${scheme.description}\n`;
      context += `   Eligibility: ${scheme.eligibility_criteria || 'Check with local authorities'}\n`;
      if (scheme.budget_allocation) {
        context += `   Budget: ₹${scheme.budget_allocation} crore\n`;
      }
      context += `   Application: ${scheme.application_process || 'Contact local agriculture department'}\n\n`;
    });
  }

  // Add conservation tips
  if (searchResults.tips.length > 0) {
    context += "CONSERVATION RECOMMENDATIONS:\n";
    searchResults.tips.forEach((tip: any, i: number) => {
      context += `${i + 1}. ${tip.title}: ${tip.description}\n`;
      context += `   Difficulty: ${tip.difficulty_level}, Cost: ${tip.cost_range}\n`;
      context += `   Steps: ${tip.implementation_steps?.join(', ')}\n\n`;
    });
  }

  // Add location-specific data
  if (locationData.length > 0) {
    context += "LOCATION-SPECIFIC DATA:\n";
    locationData.forEach((data: any, i: number) => {
      context += `${i + 1}. ${data.location_name} - ${data.metric_name}: ${data.metric_value}${data.metric_unit || ''}\n`;
      context += `   Status: ${data.status_category}, Year: ${data.assessment_year}\n`;
      if (data.recommendations) {
        context += `   Recommendations: ${data.recommendations}\n`;
      }
      context += `   Source: ${data.data_source}\n\n`;
    });
  }

  return context;
}

async function callGeminiAPI(prompt: string, userMessage: string, context: string) {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  const fullPrompt = `${prompt}\n\nCONTEXT FROM DATABASE:\n${context}\n\nUSER QUESTION: ${userMessage}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { message, userProfile, chatHistory } = await req.json();

    console.log('Processing enhanced AI chat request:', { message, userProfile });

    // Extract location from user profile or message
    const location = userProfile?.location || '';
    
    // Search knowledge base for relevant information
    const searchResults = await searchKnowledgeBase(supabaseClient, message);
    
    // Get location-specific data if location is provided
    const locationData = location ? await getLocationSpecificData(supabaseClient, location) : [];

    // Build context from search results
    const context = buildContextFromResults(searchResults, locationData);

    console.log('Context built from database:', { 
      knowledgeItems: searchResults.knowledge.length,
      schemes: searchResults.schemes.length, 
      tips: searchResults.tips.length,
      locationData: locationData.length
    });

    // Generate AI response using enhanced context
    const aiResponse = await callGeminiAPI(
      ENHANCED_SYSTEM_PROMPT, 
      message, 
      context
    );

    // Store chat interaction for analytics
    await supabaseClient
      .from('user_documents')
      .insert({
        user_id: userProfile?.id || 'anonymous',
        title: `Chat: ${message.substring(0, 50)}...`,
        file_name: `chat_${Date.now()}.txt`,
        file_path: 'chat_logs',
        original_name: 'AI Chat Log',
        mime_type: 'text/plain',
        file_size: message.length + aiResponse.length,
        category: 'chat_log',
        description: 'AI chat interaction',
        extracted_text: `User: ${message}\n\nAI: ${aiResponse}`,
        is_local_only: true
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        context_used: {
          knowledge_items: searchResults.knowledge.length,
          schemes_found: searchResults.schemes.length,
          conservation_tips: searchResults.tips.length,
          location_data: locationData.length
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