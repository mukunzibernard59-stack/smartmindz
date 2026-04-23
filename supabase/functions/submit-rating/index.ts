import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(s: string, max: number): string {
  if (!s) return s;
  return s.length > max ? s.slice(0, max) + "…" : s;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authenticated caller to prevent inbox flooding / quota abuse
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { rating, comment, device, userName } = await req.json();

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Invalid rating" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    const displayName = escapeHtml(truncate(String(userName || "Anonymous User"), 100));
    const commentText = escapeHtml(truncate(String(comment || "").trim() || "(No comment provided)", 500));
    const safeDevice = escapeHtml(truncate(String(device || "Unknown device"), 300));
    const time = new Date().toISOString();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">⭐ New App Rating</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0; font-size: 14px;">SmartMind Feedback</p>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 16px;">
            Your app has been rated by <strong style="color: #6366f1;">${displayName}</strong>
          </p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;">
            <p style="font-size: 28px; margin: 0; letter-spacing: 4px;">${stars}</p>
            <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0;">${rating} out of 5 stars</p>
          </div>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px;">Comment</p>
            <p style="font-size: 14px; color: #374151; margin: 0;">${commentText}</p>
          </div>
          <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 12px;">
            <p style="margin: 0;">📅 ${time}</p>
            <p style="margin: 4px 0 0;">📱 ${device || "Unknown device"}</p>
          </div>
        </div>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SmartMind <onboarding@resend.dev>",
        to: ["mukunzibernard59@gmail.com"],
        subject: `⭐ SmartMind rated ${rating}/5 by ${displayName}`,
        html: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await emailRes.json();

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("submit-rating error:", err);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
