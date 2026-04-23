import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, style = "realistic" } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedPrompt = prompt.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").substring(0, 1000);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Service configuration error." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stylePrompts: Record<string, string> = {
      Photorealistic: "ultra photorealistic, 8k, hyper-detailed, professional photography, sharp focus, natural lighting",
      Cinematic: "cinematic lighting, dramatic composition, film grain, color graded, movie still, depth of field",
      "3D Render": "octane render, 3D, cinema 4D, ultra detailed, physically-based rendering, cinematic lighting",
      Anime: "anime key visual, Studio Ghibli / Makoto Shinkai style, vivid colors, cel shading",
      "Digital Art": "trending on ArtStation, digital painting, highly detailed concept art",
      "Oil Painting": "oil painting, thick brush strokes, classical masterpiece, rich textures",
      Watercolor: "watercolor painting, soft washes, delicate brushwork, paper texture",
      "Pixel Art": "pixel art, 16-bit, crisp pixels, vibrant palette",
      Minimalist: "minimalist, clean, flat design, simple shapes, lots of negative space",
      Cyberpunk: "cyberpunk, neon lights, futuristic city, rain, reflections, blade runner aesthetic",
      realistic: "photorealistic, highly detailed, professional photography",
      anime: "anime style, vibrant colors",
      cartoon: "cartoon style, colorful",
      illustration: "digital illustration, detailed artwork",
    };

    const enhancedPrompt = `${sanitizedPrompt}, ${stylePrompts[style] || stylePrompts.Photorealistic}, masterpiece, award-winning, ultra high quality`;

    console.log("Generating image:", enhancedPrompt.slice(0, 200));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [{ role: "user", content: enhancedPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please wait and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Add credits in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errorText = await response.text();
      console.error("Image gen error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to generate image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image returned from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Generate image error:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
