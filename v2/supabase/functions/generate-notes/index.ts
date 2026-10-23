import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_LANGUAGES = ['en', 'fr', 'rw', 'sw'];

interface NotesData {
  title?: string;
  introduction?: { what: string; why: string; usage: string };
  terms?: { term: string; definition: string }[];
  moreToKnow?: { concepts: string[]; facts: string[]; commonMistakes: string[]; examples: string[] };
  pages?: { pageNumber: number; title: string; content: string; keyPoints: string[] }[];
}

function repairAndParseJSON(jsonStr: string): NotesData | null {
  try {
    return JSON.parse(jsonStr) as NotesData;
  } catch {
    let repaired = jsonStr.trim();
    const openBraces = (repaired.match(/{/g) || []).length;
    const closeBraces = (repaired.match(/}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/]/g) || []).length;
    repaired = repaired.replace(/,\s*"[^"]*$/, '');
    repaired = repaired.replace(/,\s*$/, '');
    repaired = repaired.replace(/:\s*"[^"]*$/, ': ""');
    repaired = repaired.replace(/:\s*$/, ': ""');
    for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
    for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';
    try {
      return JSON.parse(repaired) as NotesData;
    } catch {
      return null;
    }
  }
}

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
    const { subject, language = 'en' } = body;

    // Validate subject
    if (!subject || typeof subject !== 'string' || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid subject. Must be a string under 200 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validLanguage = VALID_LANGUAGES.includes(language) ? language : 'en';

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
    const lang = languageMap[validLanguage] || 'English';

    const prompt = `About "${subject}" in ${lang}. Return JSON:
{"title":"${subject}","introduction":{"what":"[2 sentences what it is]","why":"[2 sentences importance]","usage":"[2 sentences applications]"},"terms":[{"term":"T1","definition":"D1"},{"term":"T2","definition":"D2"},{"term":"T3","definition":"D3"}],"moreToKnow":{"concepts":["C1","C2"],"facts":["F1","F2"],"commonMistakes":["M1"],"examples":["E1"]},"pages":[{"pageNumber":1,"title":"Intro","content":"Brief intro","keyPoints":["K1"]}]}`;

    console.log("Generating notes for:", subject, "in", lang, "for user:", userId);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "Return ONLY valid JSON. No markdown. Keep responses short." },
          { role: "user", content: prompt },
        ],
        stream: false,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Notes generation error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate notes. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.error("Empty response from AI");
      return new Response(JSON.stringify({ error: "Failed to generate notes. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI wrapper response");
      return new Response(JSON.stringify({ error: "Failed to generate notes. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("No content in response");
      return new Response(JSON.stringify({ error: "Failed to generate notes. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in:", content.substring(0, 200));
      return new Response(JSON.stringify({ error: "Failed to generate notes. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let notesData = repairAndParseJSON(jsonMatch[0]);
    
    if (!notesData) {
      notesData = {
        title: `Learn: ${subject}`,
        introduction: {
          what: `${subject} is an important topic to study and understand.`,
          why: "Learning this subject helps build foundational knowledge and skills.",
          usage: "This knowledge applies to many real-world situations and careers."
        },
        terms: [{ term: subject, definition: `The main topic of study in this area.` }],
        moreToKnow: {
          concepts: ["Core fundamentals", "Key principles"],
          facts: ["An important area of study"],
          commonMistakes: ["Skipping the basics"],
          examples: ["Real-world applications"]
        },
        pages: [{ pageNumber: 1, title: "Introduction", content: `Welcome to learning about ${subject}.`, keyPoints: ["Start with fundamentals"] }]
      };
    }

    if (!notesData.title) notesData.title = `Learn: ${subject}`;
    if (!notesData.introduction) {
      notesData.introduction = { what: `${subject} is the topic of study.`, why: "It's important for learning.", usage: "Applies in many areas." };
    }

    console.log("Successfully generated notes for:", subject, "user:", userId);

    return new Response(JSON.stringify(notesData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notes function error:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again later." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
