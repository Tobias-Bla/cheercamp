import 'server-only';

type SendPasswordResetEmailInput = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PASSWORD_RESET_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Password reset link for ${to}: ${resetUrl}`);
    }

    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'Passwort für dein Cheercamp-Konto zurücksetzen',
      html: `
        <p>Hallo,</p>
        <p>du hast angefragt, dein Passwort für dein Cheercamp-Konto zurückzusetzen.</p>
        <p><a href="${resetUrl}">Neues Passwort setzen</a></p>
        <p>Der Link ist 60 Minuten gültig. Wenn du das nicht warst, kannst du diese E-Mail ignorieren.</p>
      `,
      text: `Hallo,\n\nüber diesen Link kannst du dein Cheercamp-Passwort zurücksetzen:\n${resetUrl}\n\nDer Link ist 60 Minuten gültig. Wenn du das nicht warst, kannst du diese E-Mail ignorieren.`,
    }),
  });

  if (!response.ok) {
    throw new Error('Password reset email could not be sent.');
  }
}
