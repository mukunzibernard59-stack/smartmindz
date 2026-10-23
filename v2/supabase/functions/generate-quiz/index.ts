import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
const VALID_LANGUAGES = ['en', 'fr', 'rw', 'sw'];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;

    const body = await req.json();
    const { subject, difficulty, numQuestions, language = 'en', topic = '' } = body;

    // Validate subject
    if (!subject || typeof subject !== 'string' || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid subject. Must be a string under 200 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate difficulty
    if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
      return new Response(
        JSON.stringify({ error: "Invalid difficulty. Must be easy, medium, or hard." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate numQuestions
    const num = parseInt(numQuestions);
    if (isNaN(num) || num < 1 || num > 20) {
      return new Response(
        JSON.stringify({ error: "Number of questions must be between 1 and 20." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate language and topic
    const validLanguage = VALID_LANGUAGES.includes(language) ? language : 'en';
    const validTopic = (topic && typeof topic === 'string') ? topic.substring(0, 200) : '';

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service configuration error. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const languageMap: Record<string, string> = {
      en: "English", fr: "French", rw: "Kinyarwanda", sw: "Swahili",
    };

    const prompt = `Generate ${num} ${difficulty} level quiz questions about ${subject}${validTopic ? ` specifically about "${validTopic}"` : ''}.

Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text in ${languageMap[validLanguage] || 'English'}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Brief explanation why this answer is correct in ${languageMap[validLanguage] || 'English'}"
    }
  ]
}

Rules:
- Questions must be in ${languageMap[validLanguage] || 'English'}
- Each question has exactly 4 options
- "correct" is the 0-indexed position of the correct answer
- Explanations should be educational and brief
- Vary question types and difficulty appropriately`;

    console.log("Generating quiz for:", subject, "user:", userId);

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
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Quiz generation error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate quiz. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      console.error("Empty response from AI gateway");
      return new Response(JSON.stringify({ error: "Failed to generate quiz. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI response:", responseText.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to generate quiz. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in response");
      return new Response(JSON.stringify({ error: "Failed to generate quiz. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from content:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to generate quiz. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let quizData;
    try {
      quizData = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Failed to parse quiz JSON:", jsonMatch[0].substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to generate quiz. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Successfully generated quiz for:", subject, "user:", userId);

    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Quiz function error:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
