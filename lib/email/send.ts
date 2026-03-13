import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "465", 10);
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP не настроен: проверьте SMTP_HOST, SMTP_USER, SMTP_PASS");
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const transport = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  await transport.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/verify-email?token=${token}`;

  await sendMail({
    to,
    subject: "Подтвердите email — TransLogic",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111">
        <div style="margin-bottom:24px">
          <span style="font-size:18px;font-weight:600">TransLogic</span>
        </div>
        <h2 style="font-size:16px;font-weight:600;margin:0 0 12px">Подтверждение email</h2>
        <p style="font-size:14px;color:#555;margin:0 0 24px;line-height:1.6">
          Нажмите кнопку ниже, чтобы подтвердить ваш адрес электронной почты.
          Ссылка действительна 24 часа.
        </p>
        <a href="${link}"
           style="display:inline-block;background:#111;color:#fff;text-decoration:none;
                  font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px">
          Подтвердить email
        </a>
        <p style="font-size:12px;color:#999;margin:24px 0 0;line-height:1.6">
          Если вы не регистрировались в TransLogic — просто проигнорируйте это письмо.
        </p>
      </div>
    `,
  });
}
