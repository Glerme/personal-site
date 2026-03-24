import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(1000),
  turnstileToken: z.string().min(1),
})

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').trim()

async function validateTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })
  const data = await res.json() as { success: boolean }
  return data.success
}

export default async function handler(
  req: { method: string; body: unknown },
  res: {
    status: (code: number) => {
      json: (body: unknown) => void
      end: () => void
    }
  }
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // Validate Turnstile FIRST — before parsing the full body
  const rawBody = req.body as Record<string, unknown>
  const token = typeof rawBody?.turnstileToken === 'string' ? rawBody.turnstileToken : ''
  const turnstileValid = await validateTurnstile(token)
  if (!turnstileValid) {
    return res.status(400).json({ error: 'CAPTCHA validation failed' })
  }

  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({ error: 'Invalid data', issues: parsed.error.issues })
  }

  const { name, email, subject, message } = parsed.data

  const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,       // public key (account identifier)
      accessToken: process.env.EMAILJS_PRIVATE_KEY,  // private key (server-side auth)
      template_params: {
        name: stripHtml(name),
        title: stripHtml(subject),
        message: stripHtml(message),
        reply_to: email,
      },
    }),
  })

  if (!emailRes.ok) {
    const errBody = await emailRes.text()
    console.error('[api/contact] EmailJS error:', emailRes.status, errBody)
    return res.status(502).json({ error: 'Failed to send email', detail: errBody })
  }

  return res.status(200).json({ ok: true })
}
