import { Terminal, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { personalInfo } from "@/data/portfolio-data";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-sm text-accent">
            <Terminal size={14} />
            <span>{personalInfo.name}</span>
          </div>

          <p className="text-xs text-muted flex items-center gap-1.5">
            © {year} {personalInfo.name}. {t('footer.builtWith')}
            <Heart size={12} className="text-accent fill-accent" />.
          </p>

          <div className="flex items-center gap-4">
            {personalInfo.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-accent transition-colors"
                aria-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
