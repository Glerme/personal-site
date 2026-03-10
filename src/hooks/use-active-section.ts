import { useEffect } from "react";
import { useNavigationStore } from "@/stores/navigation-store";
import type { NavSection } from "@/types/portfolio.types";

const SECTIONS: NavSection[] = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];

export function useActiveSection() {
  const setActiveSection = useNavigationStore((s) => s.setActiveSection);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [setActiveSection]);
}
