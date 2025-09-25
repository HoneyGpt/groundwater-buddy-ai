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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyAZwKdIUtVHgV0oarCGbKayQ5czxGc0uhw';
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured, using fallback');
    }

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
• Detect if user is EXPLICITLY asking for a different language (e.g., "speak in Hindi", "reply in Telugu", "answer in Tamil")
• ONLY respond in requested language when user explicitly asks for it
• Default to English for all responses unless user specifically requests another language
• If user asks "can you speak Hindi?" - respond in English explaining you can understand and respond in Hindi if requested
• If user says "respond in Hindi" or "answer in Hindi" - then respond in that language
• Use Indian context and technical terms but maintain requested language

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

    console.log('Sending request to Gemini API...');

    let generatedText = '';

    try {
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
        console.log('Received response from Gemini API');
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
        console.log('Both APIs failed, using intelligent fallback');
        
        // Smart contextual fallback based on message content
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money') || lowerMessage.includes('₹')) {
          generatedText = chatType === 'budget' ? 
            `## 💛 Budget Analysis\nI understand you're looking for budget advice! While I'm having connectivity issues, I can still help with cost-effective solutions.\n\n## 🎯 Solution Summary\nLet me provide you with practical, budget-friendly approaches for your query.\n\n## 💰 Budget Breakdown\n• Primary costs: Focus on essential items first\n• Secondary options: Consider alternatives to save money\n• Total approach: Prioritize needs over wants\n\n## 📋 Step-by-Step Action Plan\n1. **Assess Your Needs:** Clearly define what you actually need vs want\n2. **Research Options:** Compare prices and alternatives\n3. **Start Small:** Begin with minimum viable solutions\n\n## 🏛️ Government Schemes & Support\n• **PMKSY:** Water conservation subsidies up to 55-60%\n• **MGNREGA:** Employment guarantee scheme funds\n• **Local schemes:** Check with your district collector office\n\n## 💡 Money-Saving Tips\n• **DIY Approach:** Consider what you can do yourself\n• **Local Resources:** Use available community resources\n• **Bulk Buying:** Coordinate with neighbors for better rates` :
            `💧 **Budget-Friendly Water Solutions**\n\nI understand you're looking for cost-effective water management options. Here are practical suggestions:\n\n**💰 Low-Cost Options:**\n• Rainwater harvesting: ₹10,000-25,000 for basic setup\n• Drip irrigation: Government subsidy covers 55-60%\n• Water storage: Plastic tanks starting from ₹3,000\n\n**🏛️ Government Support:**\n• PMKSY scheme for irrigation subsidies\n• MGNREGA funds for water conservation\n• State-specific water schemes available\n\n**📋 Next Steps:**\n1. Visit nearest agriculture office for scheme details\n2. Get soil/water testing done (often free)\n3. Plan implementation in phases to spread costs`;
        } else if (lowerMessage.includes('water') || lowerMessage.includes('groundwater') || lowerMessage.includes('irrigation')) {
          generatedText = `💧 **INGRES-AI Water Management Guidance**\n\nI'm currently experiencing connectivity issues, but I can still provide valuable water management insights!\n\n**🌊 Groundwater Status:**\n• Check your local CGWB (Central Ground Water Board) data\n• Monitor seasonal variations in your area\n• Consider sustainable extraction practices\n\n**🚰 Conservation Methods:**\n• **Rainwater Harvesting:** Collect and store monsoon water\n• **Drip Irrigation:** Save 30-50% water compared to flood irrigation\n• **Mulching:** Reduce evaporation by 60%\n\n**🏛️ Government Schemes:**\n• **PMKSY:** Micro-irrigation subsidies\n• **Atal Bhujal Yojana:** Community groundwater management\n• **Jal Shakti Abhiyan:** Water conservation campaigns\n\n**📞 Contact Support:**\nFor immediate assistance, contact your local water resources department or agriculture extension officer.`;
        } else {
          generatedText = chatType === 'budget' ?
            `## 💛 Budget Bro Here!\nI'm experiencing some technical difficulties, but I'm still here to help with your budget needs!\n\n## 🎯 Quick Budget Tips\n• Start with essentials and work your way up\n• Look for government schemes and subsidies\n• Consider local, cost-effective alternatives\n\n## 💡 Money-Saving Approach\n• Research before spending\n• Compare multiple options\n• Ask for community recommendations\n\nTry rephrasing your question and I'll do my best to provide specific budget advice!` :
            `🌊 **INGRES-AI is here!**\n\nI'm having some connectivity issues, but I'm still ready to help with groundwater and water management questions!\n\n**Quick Help Available:**\n• Government water schemes information\n• Water conservation techniques\n• Groundwater status queries\n• Irrigation advice\n\nTry asking me about specific topics like "drip irrigation," "rainwater harvesting," or "water schemes in [your state]" and I'll provide detailed guidance!`;
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