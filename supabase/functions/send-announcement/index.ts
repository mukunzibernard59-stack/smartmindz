import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (s: string) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const personalize = (message: string, name: string) =>
  message.replace(/\{username\}/gi, name);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin, error: roleErr } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) return json({ error: "Admin access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const message = String(body?.message || "").trim();
    const audience = String(body?.audience || "all");
    if (!message || message.length > 2000) return json({ error: "Invalid message" }, 400);
    if (!["all", "new", "inactive"].includes(audience)) return json({ error: "Invalid audience" }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    // Collect auth users (emails) — paginate defensively.
    const authUsers: { id: string; email?: string | null }[] = [];
    for (let page = 1; page <= 20; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      authUsers.push(...(data?.users || []).map((u) => ({ id: u.id, email: u.email })));
      if (!data?.users?.length || data.users.length < 200) break;
    }

    const { data: profiles } = await admin
      .from("profiles")
      .select("user_id, full_name, created_at, last_active_at");
    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));

    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const matching = authUsers.filter((u) => {
      const p: any = profileMap.get(u.id);
      if (audience === "new") {
        const created = p?.created_at ? new Date(p.created_at).getTime() : 0;
        return created > 0 && now - created <= 7 * DAY;
      }
      if (audience === "inactive") {
        const active = p?.last_active_at ? new Date(p.last_active_at).getTime() : 0;
        return active > 0 && now - active >= 14 * DAY;
      }
      return true;
    });

    const { data: announcement, error: insErr } = await admin
      .from("announcements")
      .insert({
        message,
        audience,
        created_by: userData.user.id,
        recipient_count: matching.length,
      })
      .select("id")
      .single();
    if (insErr) throw insErr;

    if (matching.length > 0) {
      const { error: recErr } = await admin.from("announcement_recipients").insert(
        matching.map((u) => ({ announcement_id: announcement.id, user_id: u.id })),
      );
      if (recErr) throw recErr;
    }

    // Email everyone matching, personalized, using the same provider as app ratings.
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    let emailsSent = 0;
    if (RESEND_API_KEY) {
      for (const u of matching) {
        if (!u.email) continue;
        const name = (profileMap.get(u.id) as any)?.full_name || u.email.split("@")[0];
        const text = personalize(message, name);
        const html = `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#0891b2,#6366f1);padding:20px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:20px">Smartmindz</h1>
            </div>
            <div style="padding:24px;color:#374151;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(text)}</div>
          </div>`;
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Smartmindz <onboarding@resend.dev>",
              to: [u.email],
              subject: "New announcement from Smartmindz",
              html,
            }),
          });
          if (res.ok) emailsSent += 1;
          else console.error("Resend error:", res.status, await res.text());
        } catch (e) {
          console.error("Email failed:", e);
        }
      }
    }

    return json({
      success: true,
      announcementId: announcement.id,
      recipients: matching.length,
      emailsSent,
    });
  } catch (err) {
    console.error("send-announcement error:", err);
    return json({ error: "An internal error occurred" }, 500);
  }
});
