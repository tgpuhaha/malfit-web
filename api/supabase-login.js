// api/supabase-login.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

    const SB_URL  = process.env.SB_URL;   // 예: https://thcfcnqrufkcezhwwcho.supabase.co
    const SB_ANON = process.env.SB_ANON;  // anon public key

    const url = `${SB_URL}/auth/v1/token?grant_type=password`;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type":"application/json", "apikey": SB_ANON },
      body: JSON.stringify({ email, password })
    });

    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: text.slice(0,300) });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(text);  // { access_token, refresh_token, ... }
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
