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
    const { subject, difficulty, numQuestions, language = 'en', topic = '' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageMap: Record<string, string> = {
      en: "English",
      fr: "French",
      rw: "Kinyarwanda",
      sw: "Swahili",
    };

    const prompt = `Generate ${numQuestions} ${difficulty} level quiz questions about ${subject}${topic ? ` specifically about "${topic}"` : ''}.

Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text in ${languageMap[language] || 'English'}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation why this answer is correct in ${languageMap[language] || 'English'}"
    }
  ]
}

Rules:
- Questions must be in ${languageMap[language] || 'English'}
- Each question has exactly 4 options
- "correct" is the 0-indexed position of the correct answer
- Explanations should be educational and brief
- Vary question types and difficulty appropriately`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a quiz generator. Only respond with valid JSON. No markdown, no extra text." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Quiz generation error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate quiz." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    // Parse the JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response");
    }

    const quizData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Quiz function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
