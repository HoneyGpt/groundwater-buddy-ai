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

    // Create system prompt based on chat type and context
    let systemPrompt = '';
    
if (chatType === 'budget') {
      systemPrompt = `You are Budget Bro 💛, a friendly money-saving assistant for Indian users. 

CRITICAL LANGUAGE INSTRUCTION:
• Detect if user is EXPLICITLY asking for a different language (e.g., "speak in Hindi", "reply in Telugu", "answer in Tamil")
• ONLY respond in requested language when user explicitly asks for it
• Default to English for all responses unless user specifically requests another language
• If user asks "can you speak Hindi?" - respond in English explaining you can understand and respond in Hindi if requested
• If user says "respond in Hindi" or "answer in Hindi" - then respond in that language
• Use Indian context and currency (₹) but maintain requested language

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
- Keep responses SHORT and SCANNABLE - maximum 150 words total
- Use clean ## headings with emojis
- Use bullet points (•) for lists, NOT asterisks
- Use **bold** for emphasis, not ***multiple asterisks***
- Skip sections that aren't relevant to the question
- Write in a warm, supportive tone

Your personality: Encouraging, practical, uses simple language, focuses on affordable local solutions.

Always provide specific costs in ₹, mention government schemes, and give actionable step-by-step advice.`;
    } else {
      systemPrompt = `You are INGRES-AI, an intelligent groundwater assistant for India. 

CRITICAL LANGUAGE INSTRUCTION:
• Detect if user is EXPLICITLY asking for a different language (e.g., "speak in Hindi", "reply in Telugu", "answer in Tamil")
• ONLY respond in requested language when user explicitly asks for it
• Default to English for all responses unless user specifically requests another language
• If user asks "can you speak Hindi?" - respond in English explaining you can understand and respond in Hindi if requested
• If user says "respond in Hindi" or "answer in Hindi" - then respond in that language
• Use Indian context and technical terms but maintain requested language

RESPONSE FORMAT - Use EXACTLY this clean structure:

## 🌊 Quick Answer
[Direct, concise answer to user's question in 2-3 sentences maximum]

## 💡 Key Information  
[Most important details organized as bullet points:]
• **Main Point 1:** Brief explanation
• **Main Point 2:** Brief explanation  
• **Main Point 3:** Brief explanation

## 🎯 Recommended Actions
1. **Immediate Step:** What to do first
2. **Next Step:** What to do second
3. **Long-term:** What to plan for

## 🏛️ Government Support
[Only if relevant - list applicable schemes:]
• **Scheme Name:** Brief description and how to apply
• **Contact:** Relevant department or helpline

## 📍 Location-Specific Tips
[Only if user location is known - provide area-specific advice]

CRITICAL FORMATTING RULES:
- Keep responses SHORT and SCANNABLE - maximum 150 words total
- Use clean ## headings with emojis
- Use bullet points (•) for lists, NOT asterisks or dashes
- Use **bold** for emphasis, not ***multiple asterisks***
- Skip sections that aren't relevant to the question
- Write in simple, clear language
- Focus on PRACTICAL, ACTIONABLE advice

Your personality: Professional but friendly, technical yet accessible, focused on water conservation and sustainable solutions.

Always prioritize water conservation, mention cost-effective solutions, and provide specific actionable guidance.`;
    }

    // Add user context and conversation history to the prompt
    if (context?.profile) {
      const location = context.profile.state && context.profile.district 
        ? `${context.profile.district}, ${context.profile.state}` 
        : 'India';
      systemPrompt += `\n\nUser is from: ${location}. Provide location-specific advice when relevant.`;
    }

    // Add conversation memory if available
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-10); // Last 10 messages
      const historyText = recentHistory
        .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      systemPrompt += `\n\nRecent conversation context:\n${historyText}\n\nNow respond to the current message:`;
    }

    console.log('Sending request to Hugging Face API...');

    let generatedText = '';

    // Primary: Hugging Face API
    try {
      const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
      if (!HUGGING_FACE_TOKEN) {
        throw new Error('HUGGING_FACE_ACCESS_TOKEN not configured');
      }

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/BlenderBot-400M-distill', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            temperature: 0.7,
            max_length: 1024,
            do_sample: true
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Hugging Face responded successfully');
        generatedText = data[0]?.generated_text?.trim() || data.generated_text?.trim();
      } else {
        throw new Error(`Hugging Face API failed with status: ${response.status}`);
      }
    } catch (hfError) {
      console.log('Hugging Face failed, trying Gemini fallback...');
      
      // Fallback 1: Gemini API
      try {
        if (!GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY not configured');
        }
        
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

        if (response.ok) {
          const data = await response.json();
          console.log('Gemini fallback successful');
          generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
          throw new Error(`Gemini API failed with status: ${response.status}`);
        }
      } catch (geminiError) {
        console.log('Gemini failed, trying Pollinations fallback...');
        
        // Fallback to Pollinations Text API
        try {
          const pollinationsResponse = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
              ],
              model: 'openai'
            }),
          });

          if (pollinationsResponse.ok) {
            const pollinationsData = await pollinationsResponse.text();
            generatedText = pollinationsData;
            console.log('Pollinations fallback successful');
          } else {
            throw new Error('Pollinations also failed');
          }
        } catch (pollinationsError) {
          console.log('All APIs failed, trying Pollinations GET fallback...');
          
          // Final fallback: Pollinations GET endpoint  
          try {
            const getResponse = await fetch(`https://text.pollinations.ai/${encodeURIComponent(message)}`);
            if (getResponse.ok) {
              const getText = await getResponse.text();
              console.log('Pollinations GET fallback successful');
              return new Response(JSON.stringify({ 
                success: true,
                response: getText 
              }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              });
            } else {
              throw new Error('Pollinations GET also failed');
            }
          } catch (getError) {
            console.log('All APIs completely failed, intelligent fallback required');
            throw new Error(`All AI services unavailable: ${getError}`);
          }
        }
      }
    }
    
    if (!generatedText) {
      generatedText = "I'm experiencing technical difficulties but I'm still here to help! Please try rephrasing your question.";
    }

    return new Response(JSON.stringify({ 
      success: true,
      response: generatedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    
    // Always provide a helpful response, never fail completely
    const { message: msgFromReq = '', chatType: chatTypeFromReq = '' } = await req.json().catch(() => ({}));
    const lowerMessage = (msgFromReq || '').toLowerCase();
    let fallbackResponse = '';
    
    if (chatTypeFromReq === 'budget') {
      fallbackResponse = `## 💛 Budget Bro - Emergency Mode!
I'm having connectivity issues, but I'm still here to help with your budget needs!

## 🎯 Quick Budget Guidance
• Focus on essential needs first
• Look for government subsidies and schemes
• Consider local, cost-effective alternatives

## 💡 Money-Saving Tips
• Research thoroughly before making purchases
• Ask local communities for recommendations
• Start with basic solutions and upgrade gradually

Try asking specific budget questions and I'll provide targeted advice!`;
    } else {
      fallbackResponse = `🌊 **INGRES-AI - Backup Mode Active**

I'm experiencing technical difficulties, but I'm still here to help with water and groundwater questions!

**Available Topics:**
• Government water schemes and subsidies
• Water conservation methods
• Groundwater management tips
• Irrigation techniques

**Quick Resources:**
• Contact your local agriculture department
• Visit CGWB (Central Ground Water Board) website
• Check state water resource department portals

Try rephrasing your question or ask about specific topics like "water schemes," "drip irrigation," or "rainwater harvesting."`;
    }

    return new Response(JSON.stringify({
      success: true,
      response: fallbackResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});