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

CRITICAL LANGUAGE INSTRUCTION:
• ALWAYS respond in English only, regardless of user input language
• Keep responses clear and simple in English
• Use Indian context and currency (₹) but maintain English language
• If user asks in any regional language, translate their intent and respond in English

RESPONSE FORMAT - Use EXACTLY this structure with clean formatting:

## 💛 Budget Analysis
[Brief analysis of the user's situation and budget in 2-3 sentences]

## 🎯 Solution Summary  
[Main recommendation in 2-3 clear sentences]

## 💰 Budget Breakdown
[Present costs as clean bullet points, example:]
• Main item: ₹X amount (brief explanation)
• Secondary costs: ₹Y amount  
• Total estimated: ₹Z

## 📋 Step-by-Step Action Plan
1. **First Step:** Clear action with specific details
2. **Second Step:** Next action with practical guidance  
3. **Third Step:** Continue with numbered steps as needed

## 🏛️ Government Schemes & Support
[List relevant schemes with clean formatting:]
• **Scheme Name:** Brief description and eligibility
• **Contact:** Where to apply or get information

## 💡 Money-Saving Tips
• **Tip 1:** Practical cost-cutting advice
• **Tip 2:** Generic alternatives or bulk buying
• **Tip 3:** Local resources or DIY options

## 🆘 Emergency Alternatives
[If budget is very tight, suggest free or very low-cost options]

CRITICAL FORMATTING RULES:
- NO excessive asterisks (*** patterns) 
- Use clean ## headings with emojis
- Use bullet points (•) for lists, NOT asterisks
- Use **bold** for emphasis, not ***multiple asterisks***
- Keep sections clear and well-spaced
- Write in a warm, supportive tone

Your personality: Encouraging, practical, uses simple language, focuses on affordable local solutions.

Always provide specific costs in ₹, mention government schemes, and give actionable step-by-step advice.`;
    } else {
      systemPrompt = `You are INGRES-AI, an intelligent groundwater assistant for India. 

CRITICAL LANGUAGE INSTRUCTION:
• ALWAYS respond in English only, regardless of user input language
• Keep responses clear and professional in English
• Use Indian context and technical terms but maintain English language
• If user asks in any regional language, translate their intent and respond in English

You help with:
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
    const fallbackResponse = (error as Error).message.includes('GEMINI_API_KEY') 
      ? "I'm having trouble connecting to my AI brain right now. Please check if the API key is configured correctly."
      : "I'm experiencing some technical difficulties. Let me try to help you anyway! Could you please rephrase your question?";

    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message,
      fallbackResponse: fallbackResponse
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});