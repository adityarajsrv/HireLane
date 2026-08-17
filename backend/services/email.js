import { Resend } from "resend";
import config from "../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

const FROM = "HireLane <onboarding@resend.dev>";

export const sendOtpEmail = async (to, otp, purpose) => {
  const subject = purpose === "verify"
    ? "Verify your HireLane email"
    : "Reset your HireLane password";

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:0 auto;">
          <h2 style="color:#5b3df5;">${subject}</h2>
          <p>Your code is:</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:6px;background:#f5f4ff;padding:16px;border-radius:12px;text-align:center;">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:13px;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("[Email] Resend API error:", result.error);
      throw new Error(result.error.message || "Failed to send email");
    }

    console.log("[Email] OTP sent successfully to:", to);
  } catch (err) {
    console.error("[Email] Send failed:", err.message);
    throw err;
  }
};