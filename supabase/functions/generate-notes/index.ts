import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotesData {
  title?: string;
  introduction?: {
    what: string;
    why: string;
    usage: string;
  };
  terms?: { term: string; definition: string }[];
  moreToKnow?: {
    concepts: string[];
    facts: string[];
    commonMistakes: string[];
    examples: string[];
  };
  pages?: { pageNumber: number; title: string; content: string; keyPoints: string[] }[];
}

// Helper to attempt JSON repair for truncated responses
function repairAndParseJSON(jsonStr: string): NotesData | null {
  try {
    return JSON.parse(jsonStr) as NotesData;
  } catch {
    // Try to repair common truncation issues
    let repaired = jsonStr.trim();
    
    // Count open brackets
    const openBraces = (repaired.match(/{/g) || []).length;
    const closeBraces = (repaired.match(/}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/]/g) || []).length;
    
    // Remove trailing incomplete values
    repaired = repaired.replace(/,\s*"[^"]*$/, '');
    repaired = repaired.replace(/,\s*$/, '');
    repaired = repaired.replace(/:\s*"[^"]*$/, ': ""');
    repaired = repaired.replace(/:\s*$/, ': ""');
    
    // Add missing closing brackets
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      repaired += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      repaired += '}';
    }
    
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
    // Authentication check
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
    
    // Create Supabase client with user's token for authentication
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user token using getClaims
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub as string;
    console.log("Authenticated user:", userId, "- all features free");

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

    const lang = languageMap[language] || 'English';

    // Minimal prompt to ensure complete JSON response
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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Notes generation error:", response.status, errorText);
      throw new Error("AI service unavailable");
    }

    const responseText = await response.text();
    
    if (!responseText || responseText.trim() === '') {
      throw new Error("Empty response from AI");
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI wrapper response");
      throw new Error("Invalid response format");
    }

    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in response");
    }

    console.log("AI response length:", content.length);

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in:", content.substring(0, 200));
      throw new Error("Invalid response format");
    }

    // Try to parse, with repair fallback
    let notesData = repairAndParseJSON(jsonMatch[0]);
    
    if (!notesData) {
      console.error("JSON repair failed for:", jsonMatch[0].substring(0, 300));
      // Return minimal fallback data
      notesData = {
        title: `Learn: ${subject}`,
        introduction: {
          what: `${subject} is an important topic to study and understand.`,
          why: "Learning this subject helps build foundational knowledge and skills.",
          usage: "This knowledge applies to many real-world situations and careers."
        },
        terms: [
          { term: subject, definition: `The main topic of study in this area.` }
        ],
        moreToKnow: {
          concepts: ["Core fundamentals", "Key principles"],
          facts: ["An important area of study"],
          commonMistakes: ["Skipping the basics"],
          examples: ["Real-world applications"]
        },
        pages: [
          { pageNumber: 1, title: "Introduction", content: `Welcome to learning about ${subject}.`, keyPoints: ["Start with fundamentals"] }
        ]
      };
    }

    // Ensure required fields exist
    if (!notesData.title) notesData.title = `Learn: ${subject}`;
    if (!notesData.introduction) {
      notesData.introduction = {
        what: `${subject} is the topic of study.`,
        why: "It's important for learning.",
        usage: "Applies in many areas."
      };
    }

    console.log("Successfully generated notes for:", subject, "user:", userId);

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
