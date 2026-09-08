import "dotenv/config";
import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  if (host === "smtp.gmail.com" || host.includes("gmail")) {
    return nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail({ toEmail, otp, userName = "Music Lover" }) {
  try {
    const transporter = getTransporter();

    // Development fallback if credentials are not yet entered in .env
    if (!transporter) {
      console.log("\n=======================================================");
      console.log(`📧 [PULSE MAIL SERVER - DEV FALLBACK]`);
      console.log(`To: ${toEmail}`);
      console.log(`User: ${userName}`);
      console.log(`🔑 PASSWORD RESET OTP: ${otp}`);
      console.log(`⚠️ Configure SMTP_USER and SMTP_PASS in backend/.env for live delivery.`);
      console.log("=======================================================\n");

      return {
        success: true,
        devMode: true,
        message: "OTP generated (logged to server console in dev mode)",
      };
    }

    const fromAddress =
      process.env.SMTP_FROM?.trim() ||
      `"Pulse Music" <${process.env.SMTP_USER?.trim()}>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Pulse Music Password Reset</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b10; color: #f4f4f5; margin: 0; padding: 24px; }
        .container { max-width: 520px; margin: 0 auto; background: #14131d; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 36px 32px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }
        .header { text-align: center; margin-bottom: 28px; }
        .logo { display: inline-block; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff; text-transform: uppercase; background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .title { font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 16px; margin-bottom: 8px; text-align: center; }
        .subtitle { font-size: 14px; color: #a1a1aa; line-height: 1.6; text-align: center; margin-bottom: 28px; }
        .otp-box { background: rgba(139, 92, 246, 0.08); border: 1px dashed rgba(167, 139, 250, 0.4); border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 34px; font-weight: 900; letter-spacing: 10px; color: #c4b5fd; font-family: monospace, Courier, monospace; margin: 0; }
        .otp-note { font-size: 12px; color: #71717a; margin-top: 10px; }
        .footer { font-size: 12px; color: #52525b; text-align: center; margin-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ Pulse Music</div>
          <h1 class="title">Password Reset Request</h1>
          <p class="subtitle">Hello ${userName}, we received a request to reset your Pulse account password. Use the verification code below to proceed.</p>
        </div>

        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-note">Valid for 10 minutes · Do not share this code</div>
        </div>

        <p class="subtitle" style="font-size: 13px;">
          If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Pulse Music Streaming · All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `Your Pulse Music Verification Code: ${otp}`,
      text: `Hello ${userName},\n\nYour Pulse Music password reset OTP is: ${otp}\n\nThis code will expire in 10 minutes.\nIf you did not request this, please ignore this email.`,
      html: htmlContent,
    });

    console.log(`[PULSE MAIL SERVER] Live OTP email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[PULSE MAIL SERVER] Email delivery failed:", error.message);
    throw error;
  }
}
