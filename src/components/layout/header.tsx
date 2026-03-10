import { useEffect, useState } from "react";
import { Menu, X, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils/cn";
import { useNavigationStore } from "@/stores/navigation-store";
import { useActiveSection } from "@/hooks/use-active-section";
import type { NavSection } from "@/types/portfolio.types";

const NAV_IDS: NavSection[] = [
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];

const LANGUAGES = [
  { code: "pt-BR", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const { activeSection, isMenuOpen, toggleMenu, setMenuOpen } =
    useNavigationStore();

  useActiveSection();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  const currentLang = i18n.language.startsWith("pt") ? "pt-BR" : "en";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2 font-mono text-sm font-semibold text-accent hover:text-accent/80 transition-colors group"
            aria-label={t("nav.home")}
          >
            <Terminal
              size={16}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>guilherme.dev</span>
            <span className="animate-[blink_1s_step-end_infinite] text-accent">
              _
            </span>
          </button>

          <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label="main navigation"
          >
            {NAV_IDS.map((id) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
                  activeSection === id
                    ? "text-accent"
                    : "text-muted hover:text-foreground",
                )}
                aria-current={activeSection === id ? "page" : undefined}
              >
                {activeSection === id && (
                  <span className="absolute inset-x-2 bottom-1 h-px bg-accent rounded-full" />
                )}
                {t(`nav.${id}`)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-surface/60">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  aria-label={lang.label}
                  title={lang.label}
                  className={cn(
                    "flex items-center justify-center w-8 h-7 rounded-md text-base transition-all duration-200",
                    currentLang === lang.code
                      ? "bg-accent-dim ring-1 ring-accent/30 scale-105"
                      : "hover:bg-surface-alt opacity-50 hover:opacity-100",
                  )}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            <button
              className="md:hidden p-2 rounded-md text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? t("nav.home") : t("nav.home")}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <nav
            className="px-4 py-4 flex flex-col gap-1"
            role="navigation"
            aria-label="Menu mobile"
          >
            {NAV_IDS.map((id) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className={cn(
                  "text-left px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  activeSection === id
                    ? "bg-accent-dim text-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-alt",
                )}
              >
                {t(`nav.${id}`)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
