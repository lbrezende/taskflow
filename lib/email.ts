import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string | null) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Bem-vindo ao TaskFlow!",
    html: `
      <h1>Bem-vindo ao TaskFlow${name ? `, ${name}` : ""}!</h1>
      <p>Seu trial de 14 dias começou. Aproveite todas as features sem limites.</p>
      <p>Após o período de teste, você pode continuar com o plano gratuito (até 3 listas) ou fazer upgrade para o Pro.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Acessar o Dashboard</a></p>
    `,
  });
}
