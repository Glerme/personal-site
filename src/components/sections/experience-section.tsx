import { Briefcase, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionWrapper, SectionHeading } from '@/components/layout/section-wrapper'
import { Badge } from '@/components/ui/badge'
import { experiences } from '@/data/portfolio-data'
import { cn } from '@/utils/cn'

export function ExperienceSection() {
  const { t } = useTranslation()

  return (
    <SectionWrapper id="experience" className="bg-surface/30" label={t('experience.sectionLabel')}>
      <SectionHeading
        eyebrow={t('experience.eyebrow')}
        title={t('experience.title')}
        description={t('experience.description')}
      />

      <div className="relative">
        <div
          className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-border to-transparent hidden md:block"
          aria-hidden="true"
        />

        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const highlights = t(`data.experiences.${exp.id}.highlights`, { returnObjects: true }) as string[]

            return (
              <div
                key={exp.id}
                className={cn(
                  'relative md:pl-16 group',
                )}
              >
                <div
                  className={cn(
                    'absolute left-3 top-6 w-5 h-5 rounded-full border-2 items-center justify-center hidden md:flex',
                    exp.current
                      ? 'bg-accent border-accent shadow-[0_0_12px_rgba(0,217,255,0.5)]'
                      : 'bg-surface border-border group-hover:border-accent/50 transition-colors',
                  )}
                  aria-hidden="true"
                >
                  <Briefcase size={10} className={exp.current ? 'text-background' : 'text-muted'} />
                </div>

                <div className="rounded-xl border border-border bg-surface p-6 group-hover:border-accent/20 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {t(`data.experiences.${exp.id}.role`)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent text-sm font-medium hover:underline inline-flex items-center gap-1"
                          >
                            {exp.company}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="text-accent text-sm font-medium">{exp.company}</span>
                        )}
                        {exp.employmentType && (
                          <Badge variant="outline" className="text-xs font-mono capitalize">
                            {exp.employmentType}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={exp.current ? 'default' : 'secondary'} className="font-mono text-xs">
                        {t(`data.experiences.${exp.id}.period`)}
                      </Badge>
                      {exp.current && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {t(`data.experiences.${exp.id}.description`)}
                  </p>

                  {highlights.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-light">
                          <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs font-mono">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {index < experiences.length - 1 && (
                  <div className="md:hidden mt-8 mb-0 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
