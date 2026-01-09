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
    const { messages, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstructions: Record<string, string> = {
      en: "Respond in English.",
      fr: "Réponds en français.",
      rw: "Subiza mu Kinyarwanda.",
      sw: "Jibu kwa Kiswahili.",
    };

    const systemPrompt = `You are Smart Mind AI, a fast and helpful educational tutor. Your goal is to help students learn effectively.

CRITICAL RULES:
1. Be DIRECT and FAST - give the answer immediately, then explain
2. Keep explanations SHORT and SIMPLE - use bullet points
3. Use step-by-step format for math/science problems
4. If asked to re-explain, use SIMPLER words and examples
5. ${languageInstructions[language] || languageInstructions.en}
6. ALWAYS end your response with a follow-up question to keep the student engaged and help them learn more

Format your responses:
- Start with the direct answer
- Then provide a brief explanation (2-3 sentences max)
- Use examples when helpful
- For math: show the formula, then the solution
- END with a follow-up question like "Would you like me to explain further?" or "Can you solve this similar problem: [example]?" or "What part would you like me to clarify?"

You cover ALL subjects: Math, Science, English, History, Geography, ICT, Languages, and more.`;

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
