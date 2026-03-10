import { useState } from 'react'
import { ExternalLink, Github, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionWrapper, SectionHeading } from '@/components/layout/section-wrapper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { projects } from '@/data/portfolio-data'
import type { ProjectCategory } from '@/types/portfolio.types'
import { cn } from '@/utils/cn'

const FILTER_VALUES: (ProjectCategory | 'all')[] = ['all', 'fullstack', 'frontend', 'backend']

export function ProjectsSection() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.category === activeFilter)

  return (
    <SectionWrapper id="projects" label={t('projects.sectionLabel')}>
      <SectionHeading
        eyebrow={t('projects.eyebrow')}
        title={t('projects.title')}
        description={t('projects.description')}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => setActiveFilter(value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200',
              activeFilter === value
                ? 'bg-accent text-background border-accent font-semibold'
                : 'border-border text-muted hover:border-accent/40 hover:text-accent',
            )}
          >
            {t(`projects.filters.${value}`)}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project) => (
          <Card
            key={project.id}
            className={cn(
              'card-hover flex flex-col bg-surface border-border group',
              project.featured && 'ring-1 ring-accent/10',
            )}
          >
            <CardHeader className="gap-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base group-hover:text-accent transition-colors">
                  {t(`data.projects.${project.id}.title`)}
                </CardTitle>
                {project.featured && (
                  <Star size={14} className="text-accent shrink-0 mt-0.5 fill-accent" aria-label={t('projects.featured')} />
                )}
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {t(`data.projects.${project.id}.description`)}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 5}
                  </Badge>
                )}
              </div>
            </CardContent>

            <CardFooter className="gap-2 border-t border-border pt-4">
              {project.githubUrl && (
                <Button variant="ghost" size="sm" asChild className="text-xs">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github size={14} />
                    {t('projects.code')}
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button variant="ghost" size="sm" asChild className="text-xs text-accent">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} />
                    {t('projects.demo')}
                  </a>
                </Button>
              )}
              <span className="ml-auto text-xs text-muted font-mono">{project.year}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted">
          <p className="font-mono text-sm">{t('projects.empty')}</p>
        </div>
      )}
    </SectionWrapper>
  )
}
