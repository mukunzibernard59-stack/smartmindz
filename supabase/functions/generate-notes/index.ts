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

const prompt = `Create comprehensive learning content about "${subject}" with structured sections.

Respond ONLY with valid JSON in this exact format:
{
  "title": "Learn: ${subject}",
  "introduction": {
    "what": "Clear explanation of what this subject is",
    "why": "Why this subject is important",
    "usage": "Real-world applications and where it's commonly used"
  },
  "terms": [
    {"term": "Term Name", "definition": "Simple, clear explanation"},
    {"term": "Term 2", "definition": "Definition 2"}
  ],
  "moreToKnow": {
    "concepts": ["Key concept 1", "Key concept 2"],
    "examples": ["Practical example 1", "Example 2"],
    "commonMistakes": ["Common mistake 1", "Mistake 2"],
    "facts": ["Interesting fact 1", "Fact 2"]
  },
  "quiz": [
    {
      "question": "Question text here?",
      "options": {"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
      "correct": "A",
      "explanation": "Why A is correct"
    }
  ],
  "resources": [
    {"name": "Platform Name", "url": "https://official-url.com", "description": "Brief description"}
  ],
  "pages": [
    {
      "pageNumber": 1,
      "title": "Introduction to ${subject}",
      "content": "Detailed introduction content",
      "keyPoints": ["Key point 1", "Key point 2"]
    }
  ]
}

Rules:
- All content must be in ${languageMap[language] || 'English'}
- Provide a clear, beginner-friendly introduction with what/why/usage
- Include 6-10 most important terms with simple definitions
- Add 3-5 key concepts, practical examples, common mistakes, and interesting facts
- Create 4-5 multiple-choice quiz questions based on the content
- Include 3-5 official learning resources (use real, trusted URLs like MDN, Khan Academy, Coursera, official docs)
- Also include 5 pages for detailed reading
- Make content educational, clear, and suitable for students`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are an educational content creator. Only respond with valid JSON. No markdown, no extra text." },
          { role: "user", content: prompt },
        ],
        stream: false,
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
