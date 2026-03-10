import emailjs from '@emailjs/browser';
import type { ContactFormData } from '@/schemas/contact-schema';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      name: data.name,
      title: data.subject,
      message: data.message,
      reply_to: data.email,
    },
    PUBLIC_KEY,
  );
}
