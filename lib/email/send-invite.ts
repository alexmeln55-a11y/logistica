import { sendMail } from "@/lib/email/send";

export async function sendInviteEmail(
  to: string,
  token: string,
  inviterName: string | null
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/accept-invite?token=${token}`;
  const from = inviterName ?? "Команда TransLogic";

  await sendMail({
    to,
    subject: `Приглашение в TransLogic от ${from}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111">
        <div style="margin-bottom:24px">
          <span style="font-size:18px;font-weight:600">TransLogic</span>
        </div>
        <h2 style="font-size:16px;font-weight:600;margin:0 0 12px">Вас пригласили в систему</h2>
        <p style="font-size:14px;color:#555;margin:0 0 24px;line-height:1.6">
          <strong>${from}</strong> приглашает вас присоединиться к TransLogic.<br/>
          Нажмите кнопку ниже, чтобы принять приглашение и задать пароль.
          Ссылка действительна 7 дней.
        </p>
        <a href="${link}"
           style="display:inline-block;background:#111;color:#fff;text-decoration:none;
                  font-size:14px;font-weight:500;padding:12px 24px;border-radius:8px">
          Принять приглашение
        </a>
        <p style="font-size:12px;color:#999;margin:24px 0 0;line-height:1.6">
          Если вы не ожидали этого приглашения — просто проигнорируйте письмо.
        </p>
      </div>
    `,
  });
}
