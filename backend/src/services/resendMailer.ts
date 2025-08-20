// resendMailer.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY); // coloque a key no .env

export type SendEmailResult = {
  data: any | null;
  error: any | null;
};

export async function sendGogginsEmail(to: string): Promise<SendEmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Luis Maluco <goggins@luisfaria.dev>', // e-mail do domínio verificado
      to,
      subject: 'Your Goggins Message!',
      html: `
        <h1>Stay Hard 💪</h1>
        <p>You asked for motivation, and it arrived!</p>
        <p>Stay strong, soldier.</p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { data: null, error };
    } else {
      console.log('Email sent successfully:', data);
      return { data, error: null };
    }
  } catch (err: any) {
    console.error('Error sending email:', err);
    return { data: null, error: err };
  }
}