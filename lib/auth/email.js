import nodemailer from "nodemailer";

function getTransporter() {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Email service is not configured. Missing: ${missing.join(", ")}`);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

export async function sendPasswordResetOtp(email, otp) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your GitPulse password reset code",
    text: `Your GitPulse verification code is ${otp}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2>Reset your GitPulse password</h2><p>Use this verification code to continue:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#ea580c">${otp}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this email.</p></div>`,
  });
}
