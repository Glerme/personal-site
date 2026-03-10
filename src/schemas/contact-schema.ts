import { z } from 'zod'
import type { TFunction } from 'i18next'

export function createContactSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .min(2, t('contact.form.validation.nameMin'))
      .max(100, t('contact.form.validation.nameLong')),
    email: z
      .string()
      .email(t('contact.form.validation.emailInvalid')),
    subject: z
      .string()
      .min(3, t('contact.form.validation.subjectMin'))
      .max(150, t('contact.form.validation.subjectLong')),
    message: z
      .string()
      .min(10, t('contact.form.validation.messageMin'))
      .max(1000, t('contact.form.validation.messageLong')),
  })
}

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>
