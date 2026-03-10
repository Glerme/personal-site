import { MapPin, Mail, Github, Linkedin, Twitter, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionWrapper, SectionHeading } from '@/components/layout/section-wrapper'
import { Button } from '@/components/ui/button'
import { personalInfo } from '@/data/portfolio-data'

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
}

export function AboutSection() {
  const { t } = useTranslation()
  const bio = t('data.personalInfo.bio', { returnObjects: true }) as string[]
  const facts = t('data.personalInfo.facts', { returnObjects: true }) as { label: string; value: string }[]

  return (
    <SectionWrapper id="about" label={t('about.sectionLabel')}>
      <SectionHeading
        eyebrow={t('about.eyebrow')}
        title={t('about.title')}
        description={t('about.description')}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-6">
          {bio.map((paragraph, i) => (
            <p key={i} className="text-muted-light leading-relaxed text-base">
              {paragraph}
            </p>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" asChild>
              <a href={`mailto:${personalInfo.email}`}>
                <Mail size={16} />
                {personalInfo.email}
              </a>
            </Button>
            <div className="flex items-center gap-2">
              {personalInfo.socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon as keyof typeof SOCIAL_ICONS]
                if (!Icon) return null
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="p-2.5 rounded-lg border border-border text-muted hover:text-accent hover:border-accent/40 hover:bg-accent-dim transition-all duration-200"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted">
            <MapPin size={14} className="text-accent shrink-0" />
            <span>{t('data.personalInfo.location')}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-accent-dim border border-accent/20">
                <User size={16} className="text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">{t('about.quickFacts')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-surface-alt rounded-lg p-4 border border-border-subtle">
                  <p className="text-2xl font-bold font-mono text-accent mb-1">{fact.value}</p>
                  <p className="text-xs text-muted">{fact.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-muted text-xs">dev.profile</span>
            </div>
            <div className="space-y-2 text-xs leading-relaxed">
              <p><span className="text-accent-purple">const</span> <span className="text-accent">dev</span> <span className="text-muted">= {'{'}</span></p>
              <p className="pl-4"><span className="text-muted-light">name</span><span className="text-muted">:</span> <span className="text-green-400">"{personalInfo.name}"</span><span className="text-muted">,</span></p>
              <p className="pl-4"><span className="text-muted-light">role</span><span className="text-muted">:</span> <span className="text-green-400">"{t('data.personalInfo.title')}"</span><span className="text-muted">,</span></p>
              <p className="pl-4"><span className="text-muted-light">location</span><span className="text-muted">:</span> <span className="text-green-400">"{t('data.personalInfo.location')}"</span><span className="text-muted">,</span></p>
              <p className="pl-4"><span className="text-muted-light">available</span><span className="text-muted">:</span> <span className="text-yellow-400">true</span><span className="text-muted">,</span></p>
              <p className="pl-4"><span className="text-muted-light">coffee</span><span className="text-muted">:</span> <span className="text-yellow-400">"always"</span></p>
              <p><span className="text-muted">{'}'}</span></p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
