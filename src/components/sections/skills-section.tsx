import type { IconType } from 'react-icons'
import {
  SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiVite, SiFramer,
  SiNodedotjs, SiFastify, SiExpress, SiPostgresql, SiPrisma, SiRedis,
  SiGraphql, SiReactquery, SiDocker, SiGithubactions, SiVercel, SiLinux,
  SiNginx, SiGit, SiNeovim, SiFigma, SiVitest, SiZod,
} from 'react-icons/si'
import { Code2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SectionWrapper, SectionHeading } from '@/components/layout/section-wrapper'
import { skillCategories } from '@/data/portfolio-data'

const ICON_MAP: Record<string, IconType> = {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiFramer,
  SiNodedotjs,
  SiFastify,
  SiExpress,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiGraphql,
  SiReactquery,
  SiDocker,
  SiGithubactions,
  SiVercel,
  SiLinux,
  SiNginx,
  SiGit,
  SiNeovim,
  SiFigma,
  SiVitest,
  SiZod,
}

interface TechCardProps {
  name: string
  icon?: string
}

function TechCard({ name, icon }: TechCardProps) {
  const Icon = icon ? ICON_MAP[icon] : undefined

  return (
    <div className="flex flex-col items-center gap-2.5 px-5 py-4 rounded-xl border border-border bg-surface hover:border-accent/30 hover:bg-surface-alt transition-all duration-200 group min-w-[88px]">
      <span className="text-muted group-hover:text-accent transition-colors duration-200">
        {Icon ? (
          <Icon size={28} />
        ) : (
          <Code2 size={28} />
        )}
      </span>
      <span className="text-xs font-mono text-muted-light group-hover:text-foreground transition-colors duration-200 text-center whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

interface InfiniteMarqueeProps {
  items: { name: string; icon?: string }[]
  speed?: number
  reverse?: boolean
}

function InfiniteMarquee({ items, speed = 30, reverse = false }: InfiniteMarqueeProps) {
  const duplicated = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex gap-3"
        style={{
          animation: `marquee ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
          width: 'max-content',
        }}
      >
        {duplicated.map((item, i) => (
          <TechCard key={`${item.name}-${i}`} name={item.name} icon={item.icon} />
        ))}
      </div>
    </div>
  )
}

export function SkillsSection() {
  const { t } = useTranslation()

  return (
    <SectionWrapper id="skills" className="bg-surface/30" label={t('skills.sectionLabel')}>
      <SectionHeading
        eyebrow={t('skills.eyebrow')}
        title={t('skills.title')}
        description={t('skills.description')}
      />

      <div className="flex flex-col gap-10">
        {skillCategories.map((category, idx) => (
          <div key={category.id}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-border" />
              <h3 className="font-mono text-xs text-accent tracking-widest uppercase">
                {t(`data.skillCategories.${category.id}`)}
              </h3>
              <div className="h-px flex-1 bg-border" />
            </div>

            <InfiniteMarquee
              items={category.skills}
              speed={25 + idx * 5}
              reverse={idx % 2 !== 0}
            />
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
