import { ArrowDown, Download, Github, Linkedin, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/use-typewriter";
import { personalInfo } from "@/data/portfolio-data";

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection() {
  const { t } = useTranslation();
  const typewriterTitles = t("data.personalInfo.typewriterTitles", {
    returnObjects: true,
  }) as string[];

  const { displayText, isTyping } = useTypewriter({
    texts: typewriterTitles,
    typingSpeed: 75,
    deletingSpeed: 35,
    pauseDuration: 2200,
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label={t("hero.intro")}
    >
      <div
        className="absolute inset-0 grid-bg opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,217,255,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 animate-[fade-in_0.8s_ease_forwards]">
          <span className="inline-flex items-center gap-2 font-mono text-xs text-accent bg-accent-dim border border-accent/20 rounded-full px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            {t("hero.available")}
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-[slide-up_0.8s_ease_0.1s_both]">
          {t("hero.greeting")}{" "}
          <span className="text-gradient">{personalInfo.name}</span>
        </h1>

        <div className="h-12 sm:h-14 flex items-center justify-center mb-6 animate-[slide-up_0.8s_ease_0.2s_both]">
          <h2 className="font-mono text-xl sm:text-2xl text-muted-light font-medium">
            <span className="text-accent">&gt; </span>
            <span>{displayText}</span>
            <span
              className={`inline-block w-0.5 h-6 bg-accent ml-1 align-middle ${isTyping ? "animate-[blink_1s_step-end_infinite]" : "opacity-0"}`}
              aria-hidden="true"
            />
          </h2>
        </div>

        <p className="text-muted max-w-xl mx-auto text-base sm:text-lg leading-relaxed mb-10 animate-[slide-up_0.8s_ease_0.3s_both]">
          {t("data.personalInfo.tagline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-[slide-up_0.8s_ease_0.4s_both]">
          <Button
            size="lg"
            onClick={() => scrollToSection("projects")}
            className="group"
          >
            {t("hero.viewProjects")}
            <ArrowDown
              size={16}
              className="group-hover:translate-y-1 transition-transform"
            />
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href={personalInfo.cvUrl ?? "#"}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={16} />
              {t("hero.downloadCV")}
            </a>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 animate-[fade-in_0.8s_ease_0.5s_both]">
          {personalInfo.socialLinks.map((link) => {
            const Icon = SOCIAL_ICONS[link.icon as keyof typeof SOCIAL_ICONS];
            if (!Icon) return null;
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
            );
          })}
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <button
          onClick={() => scrollToSection("about")}
          className="p-2 rounded-full border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
          aria-label={t("hero.scrollDown")}
        >
          <ArrowDown size={16} />
        </button>
      </div>
    </section>
  );
}
