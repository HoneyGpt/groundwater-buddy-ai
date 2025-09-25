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
• ALWAYS respond in the SAME LANGUAGE as the user's question
• If user asks in Hindi, respond completely in Hindi
• If user asks in English, respond completely in English
• If user asks in Telugu, Tamil, or any other Indian language, respond in that language
• Detect the language automatically from the user's input

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
      geminiAnswer = await callGeminiAPI(question, contextHistory);
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
        geminiAnswer = `💧 Micro-Irrigation Tips (Drip/Sprinkler)
• Saves 30–50% water and boosts yields
• Use mulching with drip to reduce evaporation
• Schedule: early morning/evening to cut losses
• Check PMKSY for subsidy eligibility`;
      } else if (q.includes('rainwater') || q.includes('harvest')) {
        geminiAnswer = `🌧️ Rainwater Harvesting Ideas
• Rooftop gutters → covered tank → first-flush filter
• Farm pond lined with HDPE; de-silt before monsoon
• Recharge pit near borewell with graded filter media`;
      } else {
        geminiAnswer = "🌊 I'm experiencing temporary AI issues. I’ve added a built‑in fallback. Ask about schemes, drip irrigation, rainwater harvesting, or groundwater status and I’ll still help!";
      }
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