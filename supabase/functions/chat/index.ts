import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    
    // Require authentication
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Chat: No auth header");
      return new Response(
        JSON.stringify({ error: "Authentication required. Please sign in to continue." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log("Chat: Invalid token", authError?.message);
      return new Response(
        JSON.stringify({ error: "Session expired. Please sign in again." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, language = 'en', country, educationLevel, isVoiceMode = false } = await req.json();
    
    console.log(`Chat: Access granted for ${user.id} - all features free`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentYear = currentDate.getFullYear();

    const languageInstructions: Record<string, string> = {
      en: "Respond in English.",
      fr: "Réponds en français.",
      rw: "Subiza mu Kinyarwanda.",
      sw: "Jibu kwa Kiswahili.",
    };

    const countryContext = country ? `User's country: ${country}. Follow the official curriculum for ${country}.` : "Country not specified - use internationally recognized standards.";
    const levelContext = educationLevel ? `Education level: ${educationLevel}.` : "Education level not specified - adapt to the apparent level from the question.";

    const systemPrompt = `You are Smart Mind AI, a unified AI assistant that seamlessly combines the roles of an AI Tutor and an AI Chat companion. ${languageInstructions[language] || languageInstructions.en}

CURRENT DATE & TIME CONTEXT:
- Today's date: ${formattedDate}
- Current year: ${currentYear}
- Always use this real-world date when answering time-sensitive questions

CURRICULUM & LOCALIZATION:
- ${countryContext}
- ${levelContext}
- Follow the LATEST official curriculum and educational standards

UNIFIED ASSISTANT BEHAVIOR:
1. AUTOMATICALLY detect user intent - no need to ask which mode
2. For learning, studying, explanations, problem-solving, or skill development → respond as AI Tutor with clear, structured explanations
3. For casual conversation, opinions, advice, brainstorming, or general questions → respond naturally and conversationally
4. If a request includes both learning and conversation → blend both styles naturally
5. Be helpful, accurate, friendly, and concise at all times

AI TUTOR MODE (for educational requests):
- Provide step-by-step explanations
- Use examples and analogies
- Break down complex concepts
- Offer practice problems when helpful
- Encourage understanding over memorization

AI CHAT MODE (for conversational requests):
- Be warm, friendly, and engaging
- Share insights and perspectives naturally
- Help with brainstorming and ideation
- Offer thoughtful advice when asked
- Keep responses conversational and flowing

VOICE MODE RULES (CRITICAL):
1. You are running inside a mobile voice application with CONTINUOUS LISTENING
2. After answering, the microphone stays active - the user WILL speak again
3. Do NOT stop the conversation unless the user says "stop", "exit", or "end conversation"
4. Treat every pause as the user thinking, NOT as end of conversation
5. Always respond using natural spoken language
6. Keep answers clear, short, and conversational
7. After every response, assume the microphone is still active
8. Answer follow-up questions without resetting context
9. NEVER say "Do you want to continue?" or similar - just continue naturally
10. NEVER end with questions asking if they want more - the user will ask if needed

RESPONSE STYLE:
- Keep answers SHORT and CONVERSATIONAL for voice
- Start with the direct answer, then briefly explain
- Use simple, spoken language - avoid complex written structures
- Break topics into digestible spoken chunks
- Sound natural, like talking to a friend who's helping you learn

TRANSLATION REQUESTS:
- Provide BOTH original and translated text
- Say it naturally: "In [language], that's [translation]"

SUBJECTS COVERED:
Math, Science, English, History, Geography, ICT, Programming, Languages, Business, Arts, and ALL academic subjects.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get response. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
