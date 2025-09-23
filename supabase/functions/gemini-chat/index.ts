import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, chatType, useEnhancedKnowledge = false } = await req.json();

    // Redirect to enhanced AI chat if requested
    if (useEnhancedKnowledge) {
      const enhancedResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/enhanced-ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userProfile: context?.profile })
      });
      
      const enhancedData = await enhancedResponse.json();
      return new Response(JSON.stringify(enhancedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!message) {
      throw new Error('Message is required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Create system prompt based on chat type and context
    let systemPrompt = '';
    
    if (chatType === 'budget') {
      systemPrompt = `You are Budget Bro 💛, a friendly money-saving assistant for Indian users. 

Your personality:
- Warm, supportive, and encouraging tone
- Use simple Hindi/English mix when appropriate
- Always be practical and actionable
- Focus on affordability and local solutions

Guidelines:
- Always ask for budget if not mentioned
- Provide specific costs in Indian Rupees (₹)
- Suggest government schemes and subsidies
- Give step-by-step actionable advice
- Include local alternatives and generic options
- Mention free government services when relevant

Format your responses with:
- Clear budget breakdown
- Specific actionable steps
- Government scheme recommendations
- Money-saving tips
- Emergency alternatives if budget is very low

Example areas: health (medicines, treatments), agriculture (seeds, equipment), water (harvesting, irrigation), daily needs (groceries, utilities).`;
    } else {
      systemPrompt = `You are INGRES-AI, an intelligent groundwater assistant for India. You help with:

- Groundwater status and assessments
- Government water schemes and subsidies  
- Rainwater harvesting techniques
- Water conservation methods
- Agricultural water management
- Water quality information

Guidelines:
- Provide factual, actionable information
- Reference government schemes when relevant
- Give location-specific advice when possible
- Use technical terms but explain them simply
- Always prioritize water conservation
- Mention cost-effective solutions

Be helpful, informative, and focused on practical water management solutions for Indian farmers and citizens.`;
    }

    // Add user context to the prompt if available
    if (context?.profile) {
      const location = context.profile.state && context.profile.district 
        ? `${context.profile.district}, ${context.profile.state}` 
        : 'India';
      systemPrompt += `\n\nUser is from: ${location}. Provide location-specific advice when relevant.`;
    }

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Received response from Gemini API');

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated from Gemini API');
    }

    return new Response(JSON.stringify({ 
      success: true,
      response: generatedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    
    // Provide fallback response based on chat type
    const fallbackResponse = error.message.includes('GEMINI_API_KEY') 
      ? "I'm having trouble connecting to my AI brain right now. Please check if the API key is configured correctly."
      : "I'm experiencing some technical difficulties. Let me try to help you anyway! Could you please rephrase your question?";

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      fallbackResponse: fallbackResponse
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});