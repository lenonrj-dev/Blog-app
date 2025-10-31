import nodemailer from "nodemailer";

// Controller: POST /newsletter/subscribe
// Body esperado: { email: string, name?: string, hp?: string }
// hp = honeypot anti‑bot (deve vir vazio)
// .env necessários (exemplos no README):
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE ("true"|"false")
// NEWSLETTER_INBOX (destino das notificações; fallback = SMTP_USER)
// NEWSLETTER_FROM_EMAIL (fallback = SMTP_USER)
// NEWSLETTER_FROM_NAME (fallback = "SYN Newsletter")
// NEWSLETTER_SEND_WELCOME ("true"|"false"; default = true)
// APP_BASE_URL (links no e‑mail; fallback http://localhost:5173)

const bool = (v, fallback = false) => {
  if (v === undefined || v === null) return fallback;
  return String(v).toLowerCase() === "true";
};

// Avisos de configuração (não quebra a app, só ajuda em dev)
["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].forEach((k) => {
  if (!process.env[k]) console.warn(`[newsletter] ENV ausente: ${k}`);
});

// Transporter com pool para performance
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: bool(process.env.SMTP_SECURE, false), // true para 465 (corrigido)
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

if (process.env.NODE_ENV !== "test") {
  transporter
    .verify()
    .then(() => console.log("[newsletter] SMTP pronto"))
    .catch((err) => console.error("[newsletter] SMTP falhou:", err?.message || err));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name = "", hp = "" } = req.body || {};

    // Honeypot anti‑spam: se preenchido, retornamos sucesso silencioso
    if (typeof hp === "string" && hp.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    if (!email || !EMAIL_RE.test(String(email))) {
      return res.status(422).json({ ok: false, message: "E-mail inválido." });
    }

    // Metadados úteis
    const ua = req.get("user-agent") || "";
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "";
    const whenISO = new Date().toISOString();

    const safeName = String(name || "").trim().slice(0, 120);
    const fromName = process.env.NEWSLETTER_FROM_NAME || "SYN Newsletter";
    const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || process.env.SMTP_USER;
    const toInbox = process.env.NEWSLETTER_INBOX || process.env.SMTP_USER;
    const siteUrl = process.env.APP_BASE_URL || "http://localhost:5173";

    // 1) Notifica a caixa administrativa
    const adminSubject = `Novo cadastro na newsletter — ${fromName}`;
    const adminHtml = `
      <div style="font-family:ui-sans-serif,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 8px 0;color:#0f172a">Novo cadastro na newsletter</h2>
        <p style="margin:0 0 16px 0">Recebemos um novo interessado.</p>
        <table style="border-collapse:collapse;min-width:320px">
          <tbody>
            <tr><td style="padding:4px 8px;color:#64748b">Nome</td><td style="padding:4px 8px;color:#0f172a">${escapeHtml(safeName || "—")}</td></tr>
            <tr><td style="padding:4px 8px;color:#64748b">E-mail</td><td style="padding:4px 8px;color:#0f172a">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:4px 8px;color:#64748b">IP</td><td style="padding:4px 8px;color:#0f172a">${escapeHtml(ip)}</td></tr>
            <tr><td style="padding:4px 8px;color:#64748b">User‑Agent</td><td style="padding:4px 8px;color:#0f172a">${escapeHtml(ua)}</td></tr>
            <tr><td style="padding:4px 8px;color:#64748b">Data</td><td style="padding:4px 8px;color:#0f172a">${whenISO}</td></tr>
          </tbody>
        </table>
      </div>`;

    const adminText = `Novo cadastro na newsletter\n\nNome: ${safeName || "—"}\nE-mail: ${email}\nIP: ${ip}\nUA: ${ua}\nData: ${whenISO}`;

    await transporter.sendMail({
      from: { name: fromName, address: fromEmail },
      to: toInbox,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
      replyTo: email,
    });

    // 2) Boas‑vindas (opcional)
    if (bool(process.env.NEWSLETTER_SEND_WELCOME, true)) {
      const subscriberSubject = `Bem-vindo(a) à ${fromName}!`;
      const subscriberHtml = `
        <div style="font-family:ui-sans-serif,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2 style="margin:0 0 8px 0;color:#0f172a">Inscrição confirmada ✅</h2>
          <p style="margin:0 0 12px 0">Olá${safeName ? `, ${escapeHtml(safeName)}` : ""}! Obrigado por assinar nossa newsletter.</p>
          <p style="margin:0 0 12px 0">Você passará a receber conteúdos selecionados do blog SYN diretamente no seu e‑mail.</p>
          <p style="margin:0 0 20px 0">Se este pedido não foi feito por você, ignore esta mensagem ou <a href="mailto:${toInbox}?subject=Cancelar%20newsletter" style="color:#1d4ed8">contate o suporte</a>.</p>
          <a href="${siteUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:12px">Visitar o site</a>
        </div>`;

      const subscriberText = `Inscrição confirmada\n\nObrigado por assinar nossa newsletter. Acesse ${siteUrl}`;

      await transporter.sendMail({
        from: { name: fromName, address: fromEmail },
        to: email,
        subject: subscriberSubject,
        text: subscriberText,
        html: subscriberHtml,
      });
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("[newsletter] erro:", err?.message || err);
    return res.status(500).json({ ok: false, message: "Não foi possível processar sua assinatura." });
  }
};

// Utilitário simples para escapar HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default { subscribeNewsletter };
