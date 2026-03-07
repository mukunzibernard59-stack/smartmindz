import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RUNWAY_API = "https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION = "2024-11-06";
const POLL_INTERVAL = 5000; // 5s
const MAX_POLL_TIME = 300000; // 5 min

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, style = "cinematic", duration = 5 } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedPrompt = prompt.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").substring(0, 2000);

    const RUNWAY_API_KEY = Deno.env.get("RUNWAY_API_KEY");
    if (!RUNWAY_API_KEY) {
      return new Response(JSON.stringify({ error: "RUNWAY_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Style enhancers for the starting frame
    const styleEnhancers: Record<string, string> = {
      cinematic: "cinematic film still, dramatic lighting, movie quality, widescreen",
      anime: "anime style key frame, vibrant colors, dynamic composition",
      commercial: "professional commercial still, product photography, clean modern",
      documentary: "documentary photography, authentic, journalistic, natural light",
      educational: "educational illustration, clear, informative, professional diagram",
      "music-video": "music video aesthetic, stylized, dynamic, artistic expression",
      explainer: "clean infographic style, minimal, clear visual communication",
      "short-film": "indie film still, atmospheric, emotional, artistic cinematography",
    };

    const enhancer = styleEnhancers[style] || styleEnhancers.cinematic;

    // STEP 1: Generate a starting frame image using Lovable AI
    console.log("Step 1: Generating starting frame image...");

    const imagePrompt = `Create a photorealistic ${style} scene: ${sanitizedPrompt}. ${enhancer}. High quality, 4K resolution, suitable as a video starting frame.`;

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [{ role: "user", content: imagePrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      const errText = await imageResponse.text();
      console.error("Image generation failed:", imageResponse.status, errText);
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to generate starting frame");
    }

    const imageData = await imageResponse.json();
    const startingFrameUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!startingFrameUrl) {
      throw new Error("No starting frame image returned from AI");
    }

    console.log("Step 1 complete: Starting frame generated");

    // STEP 2: Send to Runway ML for image-to-video generation
    console.log("Step 2: Submitting to Runway ML for video generation...");

    const runwayDuration = duration === 10 ? 10 : 5;

    const runwayBody: Record<string, unknown> = {
      model: "gen4_turbo",
      promptImage: startingFrameUrl,
      promptText: `${sanitizedPrompt}. ${enhancer}. Smooth cinematic motion, natural camera movement.`,
      ratio: "1280:720",
      duration: runwayDuration,
    };

    const createResponse = await fetch(`${RUNWAY_API}/image_to_video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RUNWAY_API_KEY}`,
        "Content-Type": "application/json",
        "X-Runway-Version": RUNWAY_VERSION,
      },
      body: JSON.stringify(runwayBody),
    });

    if (!createResponse.ok) {
      const errBody = await createResponse.text();
      console.error("Runway create task failed:", createResponse.status, errBody);
      if (createResponse.status === 400 && errBody.includes("credits")) {
        return new Response(JSON.stringify({ error: "Runway credits exhausted. Please add credits to your Runway account at https://app.runwayml.com" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (createResponse.status === 401 || createResponse.status === 403) {
        return new Response(JSON.stringify({ error: "Invalid Runway API key. Please check your API key." }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (createResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Runway credits exhausted. Please add credits to your Runway account." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (createResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Runway rate limit. Please wait and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Runway API error [${createResponse.status}]: ${errBody}`);
    }

    const createData = await createResponse.json();
    const taskId = createData.id;

    if (!taskId) {
      throw new Error("No task ID returned from Runway");
    }

    console.log("Step 2 complete: Runway task created:", taskId);

    // STEP 3: Poll for completion
    console.log("Step 3: Polling for video completion...");

    const startTime = Date.now();
    let videoUrl: string | null = null;
    let lastStatus = "PENDING";

    while (Date.now() - startTime < MAX_POLL_TIME) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));

      const pollResponse = await fetch(`${RUNWAY_API}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${RUNWAY_API_KEY}`,
          "X-Runway-Version": RUNWAY_VERSION,
        },
      });

      if (!pollResponse.ok) {
        const errText = await pollResponse.text();
        console.error("Poll error:", pollResponse.status, errText);
        continue;
      }

      const pollData = await pollResponse.json();
      lastStatus = pollData.status;
      console.log("Poll status:", lastStatus);

      if (lastStatus === "SUCCEEDED") {
        videoUrl = pollData.output?.[0] || pollData.outputUrl;
        break;
      }

      if (lastStatus === "FAILED") {
        const failReason = pollData.failure || pollData.failureCode || "Unknown reason";
        console.error("Runway task failed:", failReason);
        throw new Error(`Video generation failed: ${failReason}`);
      }
    }

    if (!videoUrl) {
      throw new Error("Video generation timed out after 5 minutes");
    }

    console.log("Step 3 complete: Video ready at:", videoUrl);

    return new Response(
      JSON.stringify({
        videoUrl,
        type: "video",
        duration: runwayDuration,
        format: "mp4",
        message: "AI video generated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate video error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
