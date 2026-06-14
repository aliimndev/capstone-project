import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ─── Configuration ──────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'support@wemovies.ai';
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? 'WeMovies AI <onboarding@resend.dev>';

// ─── Route handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Parse body safely
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, subject, message } = body as Record<string, unknown>;

    // ── Server-side validation (mirrors client-side rules) ───────────────────
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !email.trim() ||
      typeof subject !== 'string' || !subject.trim() ||
      typeof message !== 'string' || !message.trim()
    ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    console.log('[contact] submission received', {
      name,
      email: `${email.slice(0, 3)}***`,
      subject,
      timestamp,
    });

    // ── Dev / preview mode — no API key configured ───────────────────────────
    if (!RESEND_API_KEY) {
      console.warn(
        '[contact] RESEND_API_KEY not set — logging submission only (dev mode)'
      );
      console.log('[contact] payload:', { name, email, subject, message, timestamp });
      return NextResponse.json(
        { success: true, message: 'Message received (dev mode — no email sent)' },
        { status: 200 }
      );
    }

    // ── Send via Resend ──────────────────────────────────────────────────────
    const resend = new Resend(RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: `${name.trim()} <${email.trim()}>`,
      subject: `[WeMovies] ${subject.trim()}`,
      html: buildEmailHtml({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        timestamp,
      }),
    });

    if (error) {
      // Never expose provider-specific error details to the client
      console.error('[contact] resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 }
      );
    }

    console.log('[contact] email sent successfully', { id: data?.id, to: TO_EMAIL });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (err) {
    // Never expose internal details to the client
    console.error('[contact] unexpected error:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── HTML email template ─────────────────────────────────────────────────────
interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

function buildEmailHtml({ name, email, subject, message, timestamp }: EmailParams): string {
  const formattedDate = new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  // Sanitise user content for safe HTML embedding
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeMessage = esc(message).replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Message — WeMovies AI</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0d1117;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#091020 0%,#0b2551 100%);border-radius:16px 16px 0 0;padding:32px 40px 28px;text-align:center;border-bottom:1px solid rgba(0,210,255,0.18);">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,210,255,0.65);">WeMovies AI</p>
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">New Contact Message</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#111827;padding:32px 40px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">

              <!-- Sender card -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                <tr>
                  <td style="background:rgba(0,210,255,0.05);border:1px solid rgba(0,210,255,0.18);border-radius:12px;padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(0,210,255,0.55);">From</p>
                    <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">${esc(name)}</p>
                    <a href="mailto:${esc(email)}" style="margin:4px 0 0;display:block;font-size:13px;color:rgba(0,210,255,0.85);text-decoration:none;">${esc(email)}</a>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Subject</p>
              <p style="margin:0 0 28px;font-size:16px;font-weight:600;color:#ffffff;">${esc(subject)}</p>

              <!-- Message -->
              <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);">Message</p>
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:20px 24px;">
                <p style="margin:0;font-size:14px;line-height:1.75;color:rgba(255,255,255,0.82);">${safeMessage}</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d1117;border-radius:0 0 16px 16px;padding:18px 40px;text-align:center;border:1px solid rgba(255,255,255,0.05);border-top:none;">
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.28);line-height:1.6;">
                Received ${formattedDate}&nbsp;&nbsp;·&nbsp;&nbsp;Reply directly to
                <a href="mailto:${esc(email)}" style="color:rgba(0,210,255,0.6);text-decoration:none;">${esc(email)}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
