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
    const { subject, language = 'en' } = await req.json();
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

const prompt = `Create learning content about "${subject}" in ${languageMap[language] || 'English'}.

Return ONLY valid JSON:
{"title":"Learn: ${subject}","introduction":{"what":"What it is (2 sentences)","why":"Why important (2 sentences)","usage":"Where used (2 sentences)"},"terms":[{"term":"Term1","definition":"Def1"},{"term":"Term2","definition":"Def2"},{"term":"Term3","definition":"Def3"},{"term":"Term4","definition":"Def4"},{"term":"Term5","definition":"Def5"}],"moreToKnow":{"concepts":["Concept1","Concept2","Concept3"],"examples":["Example1","Example2"],"commonMistakes":["Mistake1","Mistake2"],"facts":["Fact1","Fact2"]},"quiz":[{"question":"Q1?","options":{"A":"A1","B":"B1","C":"C1","D":"D1"},"correct":"A","explanation":"Why A"},{"question":"Q2?","options":{"A":"A2","B":"B2","C":"C2","D":"D2"},"correct":"B","explanation":"Why B"},{"question":"Q3?","options":{"A":"A3","B":"B3","C":"C3","D":"D3"},"correct":"C","explanation":"Why C"}],"resources":[{"name":"Resource1","url":"https://example1.com","description":"Desc1"},{"name":"Resource2","url":"https://example2.com","description":"Desc2"}]}

Keep responses concise. No markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an educational content creator. Return ONLY valid compact JSON. No markdown, no backticks, no explanation." },
          { role: "user", content: prompt },
        ],
        stream: false,
        max_tokens: 4000,
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
      console.error("Notes generation error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate notes." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      console.error("Empty response from AI gateway");
      throw new Error("Empty response from AI");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText.substring(0, 500));
      throw new Error("Invalid response format from AI");
    }

    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in response:", JSON.stringify(data).substring(0, 500));
      throw new Error("No content in response");
    }

    // Parse the JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from content:", content.substring(0, 500));
      throw new Error("Invalid JSON response");
    }

    let notesData;
    try {
      notesData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse notes JSON:", jsonMatch[0].substring(0, 500));
      throw new Error("Invalid notes data format");
    }

    return new Response(JSON.stringify(notesData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notes function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
