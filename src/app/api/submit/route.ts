import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "info@ObareMag.com";
const FROM = "OBARE Magazine <noreply@obaremag.com>";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...fields } = body;

    const subjects: Record<string, string> = {
      contact: "New Contact Message — OBARE",
      submission: "New Submission — OBARE",
      advertise: "New Advertise Enquiry — OBARE",
      event: "New Event Signup — OBARE",
    };

    const subject = subjects[type] ?? "New Form Submission — OBARE";

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#e60303;margin-bottom:24px">${subject}</h2>
        <table style="width:100%;border-collapse:collapse">
          ${Object.entries(fields)
            .filter(([, v]) => v !== undefined && v !== null && v !== "")
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:8px 12px;background:#f5f5f5;font-weight:bold;text-transform:capitalize;width:35%;border-bottom:1px solid #eee">
                ${k.replace(/([A-Z])/g, " $1").trim()}
              </td>
              <td style="padding:8px 12px;border-bottom:1px solid #eee">${v}</td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Sent from OBARE Magazine website</p>
      </div>
    `;

    await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      html,
      replyTo: fields.email ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
