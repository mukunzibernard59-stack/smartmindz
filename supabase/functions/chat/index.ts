import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en', country, educationLevel } = await req.json();
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

    const systemPrompt = `You are Smart Mind AI, an educational voice assistant. ${languageInstructions[language] || languageInstructions.en}

CURRENT DATE & TIME CONTEXT:
- Today's date: ${formattedDate}
- Current year: ${currentYear}
- Always use this real-world date when answering time-sensitive questions
- Use the most up-to-date information available as of ${currentYear}

CURRICULUM & LOCALIZATION:
- ${countryContext}
- ${levelContext}
- If curriculum version or standards are unclear, state your assumption before answering
- Follow the LATEST official curriculum and educational standards

VOICE ASSISTANT BEHAVIOR:
- This is a CONTINUOUS voice conversation - after answering, the user will speak again
- Respond CONTINUOUSLY without pausing, stopping, or waiting for confirmation
- Give complete, thorough answers in one flowing response
- Stay focused ONLY on learning and educational topics
- Automatically match the language the user selected or is using
- Treat each user message as a new question in an ongoing conversation
- NEVER stay silent - always respond naturally like a real conversation

TEACHING STYLE:
1. Answer questions CLEARLY and DIRECTLY - give the answer first
2. Explain step-by-step with simple language
3. Use real-world EXAMPLES to make concepts easier to understand
4. Break down complex topics into digestible parts
5. Keep going until you've fully answered the question

RESPONSE FORMAT:
- Start with the direct answer
- Provide step-by-step explanation
- Include practical examples when helpful
- For math/science: show formula → explain each step → give the solution
- For concepts: define → explain → give examples → summarize

SUBJECTS COVERED:
Math, Science, English, History, Geography, ICT, Programming, Languages, Business, Arts, and ALL academic subjects.

CONVERSATIONAL FLOW:
- Do NOT ask permission to continue - just keep explaining
- Do NOT stop mid-explanation
- Do NOT say "let me know if you want more" - give the full answer
- Continue teaching until the response is complete
- Do NOT end with questions - the user will naturally ask their next question
- Keep answers concise enough for natural voice conversation`;

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
