import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callGeminiAPI(question: string, conversationHistory: string = "") {
  const apiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyAZwKdIUtVHgV0oarCGbKayQ5czxGc0uhw';
  if (!apiKey) {
    console.error('Gemini API key not configured, using fallback');
  }

  const systemPrompt = `You are INGRES-AI, a specialized assistant for groundwater management in India. 

CRITICAL LANGUAGE INSTRUCTION:
• Detect if user is EXPLICITLY asking for a different language (e.g., "speak in Hindi", "reply in Telugu", "answer in Tamil")
• ONLY respond in requested language when user explicitly asks for it
• Default to English for all responses unless user specifically requests another language
• If user asks "can you speak Hindi?" - respond in English explaining you can understand and respond in Hindi if requested
• If user says "respond in Hindi" or "answer in Hindi" - then respond in that language
• Use Indian context and technical terms but maintain requested language

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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\nUser Question: ${question}${conversationHistory ? `\n\nConversation Context: ${conversationHistory}` : ''}` }]
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

    if (response.ok) {
      const data = await response.json();
      console.log('Gemini API response received:', { hasContent: !!data?.candidates?.[0]?.content });
      return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response.";
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
            { role: 'user', content: question }
          ],
          model: 'openai'
        }),
      });

      if (pollinationsResponse.ok) {
        const pollinationsData = await pollinationsResponse.text();
        console.log('Pollinations fallback successful');
        return pollinationsData;
      } else {
        throw new Error('Pollinations also failed');
      }
    } catch (pollinationsError) {
      console.log('Both APIs failed, using intelligent fallback');
      return `💧 **INGRES-AI Response**

I'm experiencing connectivity issues but I'm still here to help with your groundwater and water management questions!

**🌊 Quick Water Management Guide:**
• **Groundwater Status:** Check CGWB data for your area
• **Conservation:** Rainwater harvesting, drip irrigation, mulching
• **Government Schemes:** PMKSY (55-60% subsidy), Atal Bhujal Yojana
• **Contact:** Local agriculture department for immediate assistance

**💡 Ask me about:**
• Water schemes in your state
• Drip irrigation setup
• Rainwater harvesting methods
• Groundwater conservation techniques

Try rephrasing your question for more specific guidance!`;
    }
  }
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

    const { message, question: questionAlt, userProfile, conversationHistory } = await req.json();
    const question = message ?? questionAlt ?? '';
    
    console.log('Processing chat request:', { question, userId: userProfile?.id });

    // Check for special queries first
    const lowerQuestion = question.toLowerCase();
    
    // Handle "who made you" type questions
    if (lowerQuestion.includes('who made') || lowerQuestion.includes('who created') || 
        lowerQuestion.includes('who developed') || lowerQuestion.includes('creator') ||
        lowerQuestion.includes('maker') || lowerQuestion.includes('developer')) {
      const creatorResponse = `👩‍💻 **Created by Harshita Bhaskaruni and Team Auron Hive Tech**

🌟 **About Our Team:**
INGRES-AI was developed by **Harshita Bhaskaruni** and the innovative **Team Auron Hive Tech** to make groundwater data accessible to everyone in India.

💡 **Our Mission:**
We believe that every farmer, citizen, and policymaker deserves easy access to crucial groundwater information to make informed decisions about water resources.

🚀 **Team Auron Hive Tech** combines expertise in AI, water resource management, and user experience to create solutions that truly serve the people of India.`;

      return new Response(
        JSON.stringify({ 
          success: true,
          response: creatorResponse,
          sources: { primary_source: 'custom_response' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle contact/help queries
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('help') || 
        lowerQuestion.includes('support') || lowerQuestion.includes('email') ||
        lowerQuestion.includes('reach') || lowerQuestion.includes('assistance')) {
      const contactResponse = `📞 **Get in Touch with INGRES-AI Team**

💌 **Contact Information:**

**🛠️ Technical Help & General Queries:**
• **Ganesh**: tinkuganesh15@gmail.com

**📋 Information & Demo Requests:**
• **Anchal Jaiswal**: anchaljaiswal.1001@gmail.com

**🤝 Collaborations & Partnerships:**
• **Kishlaya Mishra**: kishlayamishra@gmail.com

**💻 Lead Developer:**
• **Tushar Chaurasia**: tusharchaurasia14@gmail.com

**❓ General Enquiries:**
• **Saurav Sharma**: isauravsharmaokay4359@gmail.com

**🎯 Customer Service & Demo Scheduling:**
• **Vivek U**: minusonebroking@gmail.com

📧 **Quick Contact**: Feel free to reach out to any team member based on your specific needs. We're here to help you make the most of groundwater data!`;

      return new Response(
        JSON.stringify({ 
          success: true,
          response: contactResponse,
          sources: { primary_source: 'custom_response' }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get recent conversation context for memory (last 8-10 messages)
    const contextHistory = conversationHistory ? 
      conversationHistory.slice(-10).map((msg: any) => 
        `${msg.isUser ? 'User' : 'INGRES-AI'}: ${msg.text}`
      ).join('\n') : "";

    // 1️⃣ Search Supabase knowledge_base first - using ilike for better user input handling
    const { data: kbResults, error } = await supabaseClient
      .from('knowledge_base')
      .select('*')
      .or(`content.ilike.%${question}%, title.ilike.%${question}%`)
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

    // 2️⃣ Get structured AI response with conversation memory and fallback
    let geminiAnswer = "";
    console.log('Calling Gemini API with context');
    try {
      console.log('About to call Gemini with question:', question.substring(0, 50));
      geminiAnswer = await callGeminiAPI(question, contextHistory);
      console.log('Gemini responded successfully with length:', geminiAnswer.length);
    } catch (geminiError) {
      console.error('All AI services failed, providing contextual help');
      const q = (question || '').toLowerCase();
      if (q.includes('scheme')) {
        geminiAnswer = `🎁 **Government Water Schemes You Can Explore**

**💧 Primary Schemes:**
• **PMKSY – Per Drop More Crop:** 55-60% subsidy for drip/sprinkler irrigation
• **Atal Bhujal Yojana:** Community groundwater management programs
• **MGNREGA:** Water conservation works funding
• **Jal Shakti Abhiyan:** Recharge structure support

**📋 Application Process:**
1. Visit State Agriculture/Horticulture Department
2. Prepare: Aadhaar, land documents, bank details
3. Check eligibility: Minimum 0.5 acres for most schemes
4. Submit application during open windows

**📞 Contact:** Local agriculture extension officer or district collector office`;
      } else if (q.includes('drip') || q.includes('sprinkler') || q.includes('irrigation')) {
        geminiAnswer = `💧 **Micro-Irrigation Complete Guide**

**🎯 Benefits:**
• Water savings: 30-50% compared to flood irrigation
• Yield increase: 20-40% higher productivity
• Electricity savings: 30-40% less power consumption

**🏛️ Government Support:**
• PMKSY subsidy: 55% (General), 60% (SC/ST/Small farmers)
• Minimum area: 0.5 acres required
• Application: State Agriculture Department

**💰 Investment:**
• Cost: ₹40,000-60,000 per acre
• Payback: 2-3 years
• Maintenance: Clean emitters weekly, flush monthly

**🔧 Technical Tips:**
• Best timing: Early morning (6-8 AM) or evening (6-8 PM)
• Use mulching to reduce evaporation by 60%
• Maintain pressure at 1.5-2.0 kg/cm²`;
      } else if (q.includes('rainwater') || q.includes('harvest')) {
        geminiAnswer = `🌧️ **Rainwater Harvesting Complete Guide**

**🏠 Rooftop System:**
• Calculation: Roof area (sqm) × Rainfall (mm) × 0.8 = Liters
• Components: Gutters → Filter → Storage tank
• Cost: ₹15,000-25,000 for basic setup

**🚜 Farm Methods:**
• Farm ponds: 100-500 cubic meter capacity
• Check dams: Stone/concrete across water flows
• Recharge pits: 3m deep near borewells

**🏛️ Government Support:**
• MGNREGA: Funds ponds, dams, watershed works
• State schemes: 75-90% subsidy available
• Jal Shakti Abhiyan: Community structures

**📊 Benefits:**
• Collection: 1mm rain on 100 sqm = 100 liters
• Annual potential: 50,000-150,000 liters per household`;
      } else {
        geminiAnswer = `🌊 **INGRES-AI is here to help!**

I'm experiencing connectivity issues but can still provide guidance on:

**🔍 Available Topics:**
• Government water schemes and subsidies
• Drip irrigation and micro-irrigation systems
• Rainwater harvesting techniques
• Groundwater conservation methods
• Water quality and testing information

**📞 Immediate Resources:**
• Contact local agriculture department
• Visit CGWB (Central Ground Water Board) portal
• Check state water resource department websites

Try asking specific questions about water schemes, irrigation methods, or conservation techniques!`;
      }
    }

    // 3️⃣ Prioritize clean AI response over raw knowledge base data
    let finalAnswer = "";
    
    if (geminiAnswer) {
      // Use AI response as primary - it's cleaner and more user-friendly
      finalAnswer = geminiAnswer;
    } else if (supabaseAnswer) {
      // Only fall back to raw knowledge base if AI fails
      finalAnswer = `🌊 **INGRES-AI Knowledge Base**\n\n${supabaseAnswer.replace('📚 **INGRES Knowledge Base**\n\n', '')}`;
    } else {
      finalAnswer = "🌊 **INGRES-AI Response**\n\nI couldn't find specific information about your query. Please try:\n• Being more specific about your location\n• Asking about government schemes\n• Requesting water conservation tips\n• Checking groundwater levels in your area";
    }

    // Store chat interaction for analytics (only if user has valid profile)
    if (userProfile?.id) {
      await supabaseClient
        .from('user_documents')
        .insert({
          user_id: userProfile.id,
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
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        response: finalAnswer,
        answer: finalAnswer,
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
        success: true,
        response: `🌊 **INGRES-AI Emergency Response**

I'm experiencing technical difficulties, but I'm still here to help!

**🆘 Quick Support:**
• Contact local agriculture department for immediate water guidance
• Visit CGWB portal for groundwater data
• Try asking simpler questions about water conservation

**💡 Available Topics:**
• Government water schemes
• Irrigation techniques  
• Rainwater harvesting
• Water conservation tips

Please try rephrasing your question and I'll do my best to help!`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});