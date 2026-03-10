import { cn } from '@/utils/cn'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

interface SectionWrapperProps {
  id: string
  className?: string
  children: React.ReactNode
  label?: string
}

export function SectionWrapper({ id, className, children, label }: SectionWrapperProps) {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      aria-label={label}
      className={cn(
        'py-20 lg:py-28 section-reveal',
        className,
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 lg:mb-16', className)}>
      {eyebrow && (
        <p className="font-mono text-xs text-accent tracking-widest uppercase mb-3">
          // {eyebrow}
        </p>
      )}
      <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-muted max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
