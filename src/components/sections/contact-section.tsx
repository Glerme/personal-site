import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Send,
  Mail,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  SectionWrapper,
  SectionHeading,
} from "@/components/layout/section-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  createContactSchema,
  type ContactFormData,
} from "@/schemas/contact-schema";
import { personalInfo } from "@/data/portfolio-data";
import { sendContactEmail } from "@/services/email-service";
import Turnstile from "react-turnstile";
import { cn } from "@/utils/cn";

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export function ContactSection() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const contactSchema = useMemo(() => createContactSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (formData: ContactFormData) => {
    setSubmitError(null);
    if (!turnstileToken) {
      setSubmitError(t("contact.form.error"));
      return;
    }
    try {
      await sendContactEmail({ ...formData, turnstileToken });
      setSubmitted(true);
      reset();
      setTurnstileToken(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setSubmitError(t("contact.form.error"));
    }
  };

  return (
    <SectionWrapper id="contact" label={t("contact.sectionLabel")}>
      <SectionHeading
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        description={t("contact.description")}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface hover:border-accent/20 transition-colors">
              <div className="p-2 rounded-md bg-accent-dim">
                <Mail size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Email</p>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-sm text-foreground hover:text-accent transition-colors"
                >
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-surface">
              <div className="p-2 rounded-md bg-accent-dim">
                <MapPin size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">
                  {t("contact.locationLabel")}
                </p>
                <span className="text-sm text-foreground">
                  {t("data.personalInfo.location")}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted mb-4">{t("contact.social")}</p>
            <div className="flex gap-3">
              {personalInfo.socialLinks.map((link) => {
                const Icon =
                  SOCIAL_ICONS[link.icon as keyof typeof SOCIAL_ICONS];
                if (!Icon) return null;
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-muted hover:text-accent hover:border-accent/40 hover:bg-accent-dim transition-all duration-200 text-sm"
                  >
                    <Icon size={16} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 lg:p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="p-4 rounded-full bg-accent-dim">
                <CheckCircle2 size={32} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold">
                {t("contact.success.title")}
              </h3>
              <p className="text-muted text-sm max-w-xs">
                {t("contact.success.message")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t("contact.form.name")} {t("contact.form.required")}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t("contact.form.namePlaceholder")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="text-xs text-red-400"
                      role="alert"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t("contact.form.email")} {t("contact.form.required")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("contact.form.emailPlaceholder")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-xs text-red-400"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  {t("contact.form.subject")} {t("contact.form.required")}
                </Label>
                <Input
                  id="subject"
                  placeholder={t("contact.form.subjectPlaceholder")}
                  aria-invalid={!!errors.subject}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                  {...register("subject")}
                />
                {errors.subject && (
                  <p
                    id="subject-error"
                    className="text-xs text-red-400"
                    role="alert"
                  >
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {t("contact.form.message")} {t("contact.form.required")}
                </Label>
                <Textarea
                  id="message"
                  placeholder={t("contact.form.messagePlaceholder")}
                  className="min-h-[140px]"
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                  {...register("message")}
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="text-xs text-red-400"
                    role="alert"
                  >
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-400/30 bg-red-400/10 text-red-400 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {submitError}
                </div>
              )}

              <Turnstile
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
                refreshExpired="auto"
              />

              <Button
                type="submit"
                size="lg"
                className={cn("w-full", isSubmitting && "opacity-80")}
                disabled={isSubmitting || !turnstileToken}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-background/40 border-t-background rounded-full" />
                    {t("contact.form.submitting")}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {t("contact.form.submit")}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
