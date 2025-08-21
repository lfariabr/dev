// resendMailer.ts
import { Resend } from 'resend';
import config from '../config/config';

// Resend expects a string API key in the constructor
const resendApiKey = config.resendApiKey?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export type SendEmailResult = {
  data: any | null;
  error: any | null;
};

export async function sendGogginsEmail(to: string): Promise<SendEmailResult> {
  if (!resend) {
    console.warn('[resendMailer] RESEND_API_KEY not set. Skipping email send.');
    return { data: null, error: null };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: 'Goggins <goggins@luisfaria.dev>', // e-mail do domínio verificado
      to,
      subject: 'Your Wake Up Call!',
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