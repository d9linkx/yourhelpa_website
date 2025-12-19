// Vercel Serverless Function — sends a welcome email to newly signed-up helpas.
// Requires the following environment variables to be set in Vercel:
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL

const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ error: 'Missing Authorization header' });
    const accessToken = match[1];

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase env vars missing');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the access token and get user info
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData?.user) {
      console.error('Supabase getUser failed', userError);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { email: verifiedEmail, id: userId } = userData.user;

    const { email, fullName } = req.body || {};

    // Basic validation
    if (!email || !fullName) {
      return res.status(400).json({ error: 'Missing email or fullName in request body' });
    }

    // Ensure the email in the body matches the authenticated user's email
    if (email !== verifiedEmail) {
      console.warn('Email mismatch between token and request body', { verifiedEmail, bodyEmail: email });
      return res.status(403).json({ error: 'Email does not match authenticated user' });
    }

    // Nodemailer config
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const FROM_EMAIL = process.env.FROM_EMAIL || `no-reply@${new URL(SUPABASE_URL).host}`;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.error('SMTP env vars missing');
      return res.status(500).json({ error: 'Email server not configured' });
    }

    const secure = SMTP_PORT === 465; // true for 465, false for others

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to YourHelpa',
      html: `
        <p>Hi ${escapeHtml(fullName)},</p>
        <p>Welcome to <strong>YourHelpa</strong> — we're excited to have you on board!</p>
        <p>Here are a few tips to get started:</p>
        <ul>
          <li>Complete your profile and add your primary services or products.</li>
          <li>Set your availability and preferred contact methods.</li>
          <li>Check requests in your dashboard and respond quickly to win jobs.</li>
        </ul>
        <p>If you need help, reply to this email or visit our help center.</p>
        <p>Cheers,<br/>The YourHelpa Team</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent', { messageId: info.messageId, userId });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-welcome error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"'`]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#96;'
    })[s];
  });
}
