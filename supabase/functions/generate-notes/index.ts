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

const prompt = `Create educational content about "${subject}" in ${languageMap[language] || 'English'}.

Return valid JSON only:
{"title":"Learn: ${subject}","introduction":{"what":"Brief explanation of what this is (2-3 sentences)","why":"Why it's important (2-3 sentences)","usage":"Real-world applications (2-3 sentences)"},"terms":[{"term":"Term1","definition":"Definition1"},{"term":"Term2","definition":"Definition2"},{"term":"Term3","definition":"Definition3"},{"term":"Term4","definition":"Definition4"},{"term":"Term5","definition":"Definition5"}],"moreToKnow":{"concepts":["Concept1","Concept2","Concept3"],"examples":["Example1","Example2"],"commonMistakes":["Mistake1","Mistake2"],"facts":["Fact1","Fact2"]},"quiz":[{"question":"Question1?","options":{"A":"OptionA","B":"OptionB","C":"OptionC","D":"OptionD"},"correct":"A","explanation":"Why correct"},{"question":"Question2?","options":{"A":"OptionA","B":"OptionB","C":"OptionC","D":"OptionD"},"correct":"B","explanation":"Why correct"}],"resources":[{"name":"Resource1","url":"https://example.com","description":"Description"}],"pages":[{"pageNumber":1,"title":"Introduction","content":"Introduction content about the topic","keyPoints":["Point1","Point2"]}]}

Keep all content educational and accurate. No markdown or backticks.`;

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
