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
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Session expired." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { letterType, details, senderName, senderAddress, recipientName, recipientAddress, subject } = await req.json();

    if (!letterType || !details) {
      return new Response(JSON.stringify({ error: "Letter type and details are required." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `You are an expert professional letter writer. Generate a formal, modern, professional letter in 2025 business format.

Letter Type: ${letterType}
Details/Purpose: ${details}
Sender Name: ${senderName || '[Your Name]'}
Sender Address: ${senderAddress || '[Your Address]'}
Recipient Name: ${recipientName || '[Recipient Name]'}
Recipient Address: ${recipientAddress || '[Recipient Address]'}
Subject: ${subject || '(generate an appropriate subject)'}
Date: ${today}

Return the letter as a JSON object with these exact fields:
{
  "senderName": "...",
  "senderAddress": "...",
  "date": "${today}",
  "recipientName": "...",
  "recipientAddress": "...",
  "subject": "...",
  "greeting": "...",
  "body": ["paragraph1", "paragraph2", ...],
  "closing": "...",
  "signatureName": "..."
}

Rules:
- Use modern 2025 business letter format
- Body should have 2-4 well-structured paragraphs
- Use professional, clear language
- Greeting should be formal (e.g., "Dear Mr./Ms. ...")
- Closing should be professional (e.g., "Sincerely,")
- Return ONLY valid JSON, no markdown`;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: "AI service not configured." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai-gateway.lovable.dev/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional letter writing assistant. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI API error:", errText);
      return new Response(JSON.stringify({ error: "Failed to generate letter." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices[0].message.content;
    
    // Strip markdown code fences if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const letterContent = JSON.parse(content);

    return new Response(JSON.stringify({ letter: letterContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "An error occurred." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
