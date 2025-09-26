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
        
        // Smart contextual fallback - provide actual helpful responses
        const lowerMessage = message.toLowerCase();
        
        // Water schemes specific questions
        if (lowerMessage.includes('scheme') && (lowerMessage.includes('water') || lowerMessage.includes('conservation') || lowerMessage.includes('apply'))) {
          generatedText = `🌊 **Water Conservation Schemes You Can Apply For:**

**🏛️ Major Government Schemes:**

**1. PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)**
• Subsidy: 55-75% for micro-irrigation systems
• Coverage: Drip irrigation, sprinkler systems
• Apply: Through District Agriculture Officer

**2. Atal Bhujal Yojana (Atal Jal)**
• Focus: Community-based groundwater management
• Benefits: Water harvesting infrastructure support
• Apply: Through State Water Resources Department

**3. MGNREGA Water Conservation**
• 100% wage support for water conservation works
• Includes: Farm ponds, check dams, recharge structures
• Apply: Through local Gram Panchayat

**4. National Rural Drinking Water Programme**
• Coverage: Household water connections
• Focus: Safe drinking water access
• Apply: Through District Collector Office

**📋 Application Steps:**
1. Visit nearest Agriculture/Water Department office
2. Submit land documents and application form
3. Get technical assessment done
4. Receive approval and start implementation

**📞 Contact:**
• District Agriculture Officer: For PMKSY
• Water Resources Dept: For Atal Jal
• Gram Panchayat: For MGNREGA works

Would you like specific details about any of these schemes?`;
        
        } else if (lowerMessage.includes('rainwater') && lowerMessage.includes('harvest')) {
          generatedText = `🌧️ **Rainwater Harvesting Methods:**

**🏠 Rooftop Rainwater Harvesting:**
• Cost: ₹15,000-50,000 depending on house size
• Components: Gutters, downpipes, first flush diverter, storage tank
• Capacity: 1000-5000 liters storage typically
• Government subsidy: Up to 50% in many states

**🚜 Farm Pond Construction:**
• Size: 100-500 cubic meters capacity
• Cost: ₹50,000-2,00,000 (MGNREGA provides 100% funding)
• Benefits: Irrigation + groundwater recharge
• Technical support: Available through agriculture department

**⛲ Recharge Wells/Pits:**
• Cost: ₹10,000-30,000 per structure
• Function: Directly recharge groundwater
• Suitable for: Areas with good soil percolation
• Maintenance: Minimal, clean annually

**🌊 Check Dams:**
• Community-level water harvesting
• Funding: Available through watershed programs
• Benefits: Flood control + groundwater recharge
• Apply through: District Rural Development Agency

**📋 Implementation Steps:**
1. Assess your catchment area and water needs
2. Choose appropriate method based on land/budget
3. Get technical design from agriculture department
4. Apply for government subsidy schemes
5. Implement during dry season (Oct-May)

**💡 Pro Tips:**
• Start small with rooftop harvesting
• Combine with water-efficient irrigation
• Regular maintenance ensures long-term benefits

Need help calculating capacity for your specific area?`;
        
        } else if (lowerMessage.includes('groundwater') || lowerMessage.includes('water level') || lowerMessage.includes('punjab') || lowerMessage.includes('status')) {
          generatedText = `💧 **Groundwater Status Information:**

**🔍 How to Check Groundwater Status:**
• Visit CGWB website: cgwb.gov.in
• Check district-wise groundwater reports
• Look for "State of Groundwater" annual reports
• Contact local CGWB office for latest data

**⚠️ Critical States/Regions:**
• **Punjab**: 76% blocks over-exploited
• **Haryana**: 62% blocks critical/over-exploited  
• **Rajasthan**: Western parts critically affected
• **Gujarat**: Coastal areas facing salinity issues

**📊 Understanding Groundwater Categories:**
• **Safe**: <70% extraction of annual recharge
• **Semi-Critical**: 70-90% extraction
• **Critical**: 90-100% extraction
• **Over-Exploited**: >100% extraction

**🚨 Warning Signs:**
• Declining water levels in wells
• Increasing pumping costs
• Water quality deterioration
• Land subsidence in extreme cases

**✅ Sustainable Management:**
• Adopt micro-irrigation (drip/sprinkler)
• Practice crop diversification
• Install rainwater harvesting systems
• Follow cropping patterns suitable to your region

**🏛️ Government Initiatives:**
• Jal Shakti Abhiyan for water conservation
• Atal Bhujal Yojana for community management
• PMKSY for efficient irrigation systems

**📞 Get Local Data:**
Contact your nearest CGWB office or State Groundwater Department for area-specific information and latest monitoring data.

Which specific area are you interested in knowing about?`;
        
        } else if (lowerMessage.includes('conservation') && lowerMessage.includes('tips')) {
          generatedText = `🌱 **Water Conservation Tips for Farmers:**

**🚿 Irrigation Efficiency:**
• **Drip Irrigation**: Save 30-50% water, increase yield by 20-25%
• **Sprinkler Systems**: 25-40% water savings vs flood irrigation
• **Timing**: Irrigate early morning or evening to reduce evaporation
• **Scheduling**: Use soil moisture sensors or follow crop-specific schedules

**🌾 Crop Management:**
• **Mulching**: Use organic mulch to reduce evaporation by 60%
• **Crop Selection**: Choose drought-resistant varieties
• **Mixed Cropping**: Combine water-intensive with drought-tolerant crops
• **Crop Rotation**: Include legumes to improve soil water retention

**💧 Water Harvesting:**
• **Farm Ponds**: Store rainwater for dry spells
• **Bunding**: Create field bunds to prevent runoff
• **Trenches**: Dig trenches along field boundaries
• **Recharge Pits**: Allow rainwater to seep into groundwater

**🌿 Soil Health:**
• **Organic Matter**: Add compost to improve water holding capacity
• **Cover Crops**: Grow cover crops during off-season
• **Reduced Tillage**: Minimize soil disturbance to retain moisture
• **Contour Farming**: Follow land contours to prevent erosion

**💰 Cost-Effective Methods:**
• **Plastic Mulching**: ₹8,000-12,000 per acre (Government subsidy available)
• **Drip Systems**: ₹25,000-40,000 per acre (55-75% subsidy under PMKSY)
• **Farm Ponds**: Fully funded under MGNREGA
• **Sprinklers**: ₹15,000-25,000 per acre (50-60% subsidy)

**📱 Technology:**
• Use weather-based irrigation apps
• Install soil moisture sensors
• Monitor water usage with digital meters
• Join farmer WhatsApp groups for water-saving tips

**🏛️ Government Support:**
• Apply for PMKSY micro-irrigation subsidy
• Use MGNREGA for water conservation structures
• Contact KVK (Krishi Vigyan Kendra) for training
• Join Farmer Producer Organizations (FPOs)

Start with one method and gradually expand. Which conservation technique interests you most?`;
        
        } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money') || lowerMessage.includes('₹')) {
          generatedText = chatType === 'budget' ? 
            `## 💛 Budget Analysis\nLet me help you with cost-effective solutions for your specific needs!\n\n## 🎯 Smart Budget Approach\n• Prioritize essential items first\n• Look for government subsidies (can save 50-75%)\n• Consider phased implementation to spread costs\n• Explore community/group buying options\n\n## 💰 Cost-Saving Strategies\n• **Government Schemes**: PMKSY offers 55-75% subsidy\n• **MGNREGA**: 100% funding for water conservation works\n• **Bulk Purchase**: Coordinate with neighbors for better rates\n• **Local Materials**: Use locally available resources\n\n## 📋 Budget Planning Steps\n1. **Define Requirements**: List exactly what you need\n2. **Research Subsidies**: Check eligibility for government schemes\n3. **Get Quotes**: Compare prices from multiple vendors\n4. **Plan Timeline**: Implement in phases if budget is tight\n\n## 🆘 Low-Budget Options\n• Start with basic rainwater harvesting (₹5,000-15,000)\n• Use plastic mulch instead of expensive alternatives\n• DIY solutions where possible\n• Community-shared equipment\n\nWhat specific budget range are you working with?` :
            `💰 **Budget-Friendly Water Solutions**\n\nHere are cost-effective water management options with actual pricing:\n\n**🏡 Low-Cost Options:**\n• **Rainwater Tank**: ₹3,000-8,000 (1000-2000L capacity)\n• **Drip Kit**: ₹2,500-5,000 per acre (small scale)\n• **Farm Pond Lining**: ₹15-25 per sq ft\n• **Mulch Film**: ₹8,000-12,000 per acre\n\n**🏛️ Government Subsidized:**\n• **PMKSY Drip**: Pay only 25-45% of cost\n• **MGNREGA Pond**: 100% free under employment scheme\n• **State Schemes**: Additional 10-20% support available\n\n**📋 Budget Planning:**\n1. Start with rainwater harvesting (immediate impact)\n2. Apply for government schemes (save 50-75%)\n3. Implement in phases to spread costs\n4. Join farmer groups for bulk purchasing\n\n**💡 Money-Saving Tips:**\n• Use local materials where possible\n• DIY installation for simple systems\n• Coordinate with neighbors for better rates\n• Choose durable options to avoid replacement costs\n\nWhat's your approximate budget range?`;
        } else {
          generatedText = chatType === 'budget' ?
            `## 💛 Budget Bro Here!\nReady to help you save money and make smart spending decisions!\n\n## 🎯 What I Can Help With:\n• Cost analysis for any purchase or project\n• Finding government schemes and subsidies\n• Budget planning and cost optimization\n• Comparing options to get best value\n\n## 💡 Quick Money-Saving Tips:\n• Always check for government subsidies first\n• Compare at least 3 options before buying\n• Consider long-term value over just initial cost\n• Ask local communities for recommendations\n\nTell me about your specific budget needs!` :
            `🌊 **INGRES-AI Water Expert**\n\nI can help you with:\n\n**💧 Water Management:**\n• Groundwater status and monitoring\n• Conservation techniques and methods\n• Irrigation system selection and optimization\n• Water quality assessment and solutions\n\n**🏛️ Government Schemes:**\n• PMKSY application process and benefits\n• MGNREGA water conservation works\n• State-specific water schemes\n• Subsidy calculations and eligibility\n\n**🌱 Practical Solutions:**\n• Rainwater harvesting system design\n• Drip irrigation setup and maintenance\n• Crop-specific water requirements\n• Cost-effective water storage options\n\nWhat specific water-related question can I help you with?`;
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