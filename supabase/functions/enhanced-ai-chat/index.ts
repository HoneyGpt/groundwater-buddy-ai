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

CRITICAL LANGUAGE INSTRUCTION:
• ALWAYS respond in English only, regardless of user input language
• Keep responses clear and professional in English
• Use Indian context and technical terms but maintain English language
• If user asks in any regional language, translate their intent and respond in English

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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error response:', errorText);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Gemini API response received:', { hasContent: !!data?.candidates?.[0]?.content });
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

    // Get recent conversation context for memory
    const contextHistory = conversationHistory ? 
      conversationHistory.slice(-6).map((msg: any) => 
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

    // 2️⃣ Get structured AI response with conversation memory
    let geminiAnswer = "";
    console.log('Calling Gemini API with context');
    try {
      console.log('About to call Gemini with question:', question.substring(0, 50));
      geminiAnswer = await callGeminiAPI(question, contextHistory);
      console.log('Gemini responded successfully with length:', geminiAnswer.length);
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      const q = (question || '').toLowerCase();
      if (q.includes('scheme')) {
        geminiAnswer = `🎁 Government Water Schemes You Can Explore

1) PMKSY – Per Drop More Crop
• Drip/sprinkler subsidy up to 55% (General) / 60% (SC/ST/Small & Marginal)
• Apply via your State Agriculture Dept. portal or nearest agriculture office

2) Atal Bhujal Yojana (Atal Jal)
• Community-led groundwater management in selected blocks
• Focus on water budgeting & recharge works with village committees

3) MGNREGA + Water Conservation
• Funds for farm ponds, check dams, contour bunding, trenching
• Ask Gram Panchayat for sanctioned works in your village

4) Jal Shakti Abhiyan
• Convergence program for recharge structures; check district water resources office

Next steps:
• Visit Schemes tab in the app → filter by your state
• Keep Aadhaar, land docs, and bank details handy
• Ask local agriculture/horticulture office for current subsidy windows`;
      } else if (q.includes('drip') || q.includes('sprinkler')) {
        geminiAnswer = `💧 **Micro-Irrigation Complete Guide**

**🎯 System Benefits:**
• Water savings: 30–50% compared to flood irrigation
• Yield increase: 20-40% higher crop productivity
• Fertilizer efficiency: Precise nutrient delivery through fertigation
• Soil health: Prevents erosion and reduces salinization

**💡 Best Implementation Practices:**
• **Optimal Timing:** Early morning (6-8 AM) or evening (6-8 PM)
• **Mulching:** Use plastic/organic mulch to reduce evaporation by 60%
• **System Maintenance:** Clean emitters weekly, flush lines monthly
• **Filtration:** Install sand and disc filters to prevent clogging

**🏛️ Government Subsidy Support:**
• **PMKSY Scheme:** 55% subsidy (General category), 60% (SC/ST/Small farmers)
• **Application Process:** State Horticulture/Agriculture Department
• **Minimum Area:** 0.5 acres required for subsidy eligibility
• **Required Documents:** Land records, Aadhaar, bank details

**💰 Cost-Benefit Analysis:**
• Initial Investment: ₹40,000-60,000 per acre
• Water Cost Savings: 40-50% reduction in pumping
• Electricity Savings: 30-40% less power consumption
• Return on Investment: 2-3 years payback period

**🔧 Technical Setup Tips:**
• Plan layout based on crop spacing requirements
• Use pressure compensating emitters for uniform water distribution
• Install timer-based automation for consistent scheduling
• Maintain system pressure at 1.5-2.0 kg/cm² for optimal performance`;
      } else if (q.includes('rainwater') || q.includes('harvest')) {
        geminiAnswer = `🌧️ **Rainwater Harvesting Complete Guide**

**🏠 Rooftop Harvesting System:**
• **Components:** Gutters → First-flush diverter → Storage tank
• **Calculation:** Roof area (sqm) × Rainfall (mm) × 0.8 = Liters collected
• **Tank Requirements:** For 100 sqm roof, minimum 1000L capacity
• **Installation Cost:** ₹15,000-25,000 for basic setup

**🚜 Farm-Level Harvesting Methods:**
• **Farm Ponds:** HDPE-lined, 100-500 cubic meter capacity
• **Check Dams:** Stone/concrete structures across natural water flows
• **Contour Bunding:** Follow land contours to prevent runoff
• **Recharge Pits:** 3m deep near borewells with graded filter media

**💡 Implementation Steps:**
1. **Immediate Actions:** Install roof gutters, direct to existing containers
2. **Pre-Monsoon:** De-silt existing ponds, repair damaged bunds
3. **Long-term:** Construct dedicated recharge structures

**🏛️ Government Support Available:**
• **MGNREGA:** Funds farm ponds, check dams, watershed works
• **Jal Shakti Abhiyan:** Community-level recharge structures
• **State Schemes:** 75-90% subsidy for rural water harvesting

**📊 Expected Benefits:**
• Water Collection: 1mm rain on 100 sqm = 100 liters
• Annual Potential: 50,000-150,000 liters per household
• Groundwater Recharge: 30-40% of harvested rainwater percolates

**⚙️ Technical Specifications:**
• First-flush diversion: Remove first 2-3mm of rainfall
• Storage materials: Food-grade only for drinking water
• Overflow management: Connect to recharge pit or drainage`;
      } else {
        geminiAnswer = "🌊 I'm experiencing temporary AI issues. I’ve added a built‑in fallback. Ask about schemes, drip irrigation, rainwater harvesting, or groundwater status and I’ll still help!";
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