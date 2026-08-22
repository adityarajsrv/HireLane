import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

const buildEmailHtml = (subject, otp) => `
  <div style="font-family:'Segoe UI',sans-serif;max-width:420px;margin:0 auto;padding:24px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
      <div style="width:24px;height:24px;border-radius:6px;background:#5b3df5;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:12px;">H</div>
      <span style="font-size:16px;font-weight:700;"><span style="color:#1bd29c;">Hire</span><span style="color:#5b3df5;">Lane</span></span>
    </div>
    <h2 style="color:#0a0a0f;font-size:18px;">${subject}</h2>
    <p style="color:#6b7280;font-size:13px;">Your verification code is:</p>
    <div style="font-size:32px;font-weight:700;letter-spacing:8px;background:#f5f4ff;padding:20px;border-radius:12px;text-align:center;color:#5b3df5;margin:16px 0;">
      ${otp}
    </div>
    <p style="color:#9ca3af;font-size:12px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
  </div>
`;

export const sendOtpEmail = async (to, otp, purpose) => {
  const subject = purpose === "verify" ? "Verify your HireLane email" : "Reset your HireLane password";

  try {
    const info = await transporter.sendMail({
      from: `"HireLane" <${config.GMAIL_USER}>`,
      to,
      subject,
      html: buildEmailHtml(subject, otp),
    });
    console.log("[Email] OTP sent successfully to:", to, "| messageId:", info.messageId);
  } catch (err) {
    console.error("[Email] Send failed:", err.message);
    throw err;
  }
};

export const sendContactEmail = async ({ name, email, message }) => {
  try {
    const info = await transporter.sendMail({
      from: `"HireLane Contact" <${config.GMAIL_USER}>`,
      to: config.GMAIL_USER,
      replyTo: email,
      subject: `HireLane Contact — ${name || "Website visitor"}`,
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
            <div style="
              width:28px;
              height:28px;
              border-radius:7px;
              background:#5b3df5;
              color:white;
              display:flex;
              align-items:center;
              justify-content:center;
              font-weight:bold;
              font-size:14px;
            ">
              H
            </div>

            <span style="font-size:18px;font-weight:700;">
              <span style="color:#1bd29c;">Hire</span><span style="color:#5b3df5;">Lane</span>
            </span>
          </div>

          <h2 style="color:#0a0a0f;font-size:20px;margin-bottom:20px;">
            New Contact Message
          </h2>

          <div style="
            background:#f5f4ff;
            border-radius:12px;
            padding:16px;
            margin-bottom:16px;
          ">
            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">
              <strong>Name</strong>
            </p>
            <p style="margin:0;color:#0a0a0f;font-size:14px;">
              ${name || "Not provided"}
            </p>
          </div>

          <div style="
            background:#f5f4ff;
            border-radius:12px;
            padding:16px;
            margin-bottom:16px;
          ">
            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">
              <strong>Email</strong>
            </p>
            <p style="margin:0;color:#0a0a0f;font-size:14px;">
              ${email}
            </p>
          </div>

          <div style="
            background:#f5f4ff;
            border-radius:12px;
            padding:16px;
          ">
            <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">
              <strong>Message</strong>
            </p>

            <p style="
              margin:0;
              color:#0a0a0f;
              font-size:14px;
              line-height:1.6;
              white-space:pre-wrap;
            ">
              ${message}
            </p>
          </div>

        </div>
      `,
      text: `
New HireLane Contact Message

Name: ${name || "Not provided"}
Email: ${email}

Message:
${message}
      `,
    });

    console.log(
      "[Email] Contact message sent successfully | messageId:",
      info.messageId
    );

    return info;
  } catch (err) {
    console.error("[Email] Contact send failed:", err.message);
    throw err;
  }
};