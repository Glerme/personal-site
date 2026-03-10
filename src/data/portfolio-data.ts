import type {
  PersonalInfo,
  Project,
  SkillCategory,
  Experience,
} from "@/types/portfolio.types";

export const personalInfo: PersonalInfo = {
  name: "Guilherme Felipe",
  email: "guiggff@gmail.com",
  cvUrl: "/cv.pdf",
  avatarUrl: undefined,
  socialLinks: [
    { label: "GitHub", url: "https://github.com/glerme", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/glerme",
      icon: "linkedin",
    },
    { label: "Twitter", url: "https://twitter.com/gui", icon: "twitter" },
  ],
};

export const projects: Project[] = [
  {
    id: "saas-dashboard",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"],
    category: "fullstack",
    githubUrl: "https://github.com/gui/saas-dashboard",
    liveUrl: "https://demo.saas-dashboard.dev",
    featured: true,
    year: 2024,
  },
  {
    id: "ecommerce-api",
    tags: ["Node.js", "Fastify", "PostgreSQL", "Stripe", "RabbitMQ"],
    category: "backend",
    githubUrl: "https://github.com/gui/ecommerce-api",
    featured: true,
    year: 2024,
  },
  {
    id: "design-system",
    tags: ["React", "TypeScript", "Storybook", "Vitest", "Tailwind"],
    category: "frontend",
    githubUrl: "https://github.com/gui/design-system",
    liveUrl: "https://design.guilherme.dev",
    featured: true,
    year: 2023,
  },
  {
    id: "task-manager",
    tags: ["React", "TypeScript", "WebSockets", "Zustand", "Tailwind"],
    category: "fullstack",
    githubUrl: "https://github.com/gui/task-manager",
    liveUrl: "https://tasks.guilherme.dev",
    featured: false,
    year: 2023,
  },
  {
    id: "cli-tool",
    tags: ["Node.js", "TypeScript", "Commander.js", "Inquirer"],
    category: "backend",
    githubUrl: "https://github.com/gui/dev-cli",
    featured: false,
    year: 2023,
  },
  {
    id: "portfolio",
    tags: ["React", "TypeScript", "TailwindCSS", "Vite"],
    category: "frontend",
    githubUrl: "https://github.com/gui/portfolio",
    liveUrl: "https://guilherme.dev",
    featured: false,
    year: 2025,
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    skills: [
      { name: "React", level: "expert", icon: "SiReact" },
      { name: "TypeScript", level: "expert", icon: "SiTypescript" },
      { name: "Next.js", level: "advanced", icon: "SiNextdotjs" },
      { name: "TailwindCSS", level: "expert", icon: "SiTailwindcss" },
      { name: "Vite", level: "advanced", icon: "SiVite" },
      { name: "Zustand", level: "advanced" },
      { name: "TanStack Query", level: "advanced", icon: "SiReactquery" },
      { name: "Framer Motion", level: "intermediate", icon: "SiFramer" },
    ],
  },
  {
    id: "backend",
    skills: [
      { name: "Node.js", level: "expert", icon: "SiNodedotjs" },
      { name: "Fastify", level: "advanced", icon: "SiFastify" },
      { name: "Express", level: "expert", icon: "SiExpress" },
      { name: "PostgreSQL", level: "advanced", icon: "SiPostgresql" },
      { name: "Prisma", level: "advanced", icon: "SiPrisma" },
      { name: "Redis", level: "intermediate", icon: "SiRedis" },
      { name: "REST APIs", level: "expert" },
      { name: "GraphQL", level: "intermediate", icon: "SiGraphql" },
    ],
  },
  {
    id: "devops",
    skills: [
      { name: "Docker", level: "advanced", icon: "SiDocker" },
      { name: "GitHub Actions", level: "advanced", icon: "SiGithubactions" },
      { name: "Vercel", level: "advanced", icon: "SiVercel" },
      { name: "AWS", level: "intermediate" },
      { name: "Linux", level: "advanced", icon: "SiLinux" },
      { name: "Nginx", level: "intermediate", icon: "SiNginx" },
    ],
  },
  {
    id: "tools",
    skills: [
      { name: "Git", level: "expert", icon: "SiGit" },
      { name: "Neovim", level: "advanced", icon: "SiNeovim" },
      { name: "Figma", level: "intermediate", icon: "SiFigma" },
      { name: "Vitest", level: "advanced", icon: "SiVitest" },
      { name: "Playwright", level: "intermediate" },
      { name: "Zod", level: "advanced", icon: "SiZod" },
    ],
  },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    company: "TechCorp",
    companyUrl: "https://techcorp.com",
    startDate: "2023-01",
    current: true,
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
  },
  {
    id: "exp-2",
    company: "StartupXYZ",
    companyUrl: "https://startupxyz.com",
    startDate: "2021-03",
    endDate: "2022-12",
    current: false,
    technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Storybook"],
  },
  {
    id: "exp-3",
    company: "Agência Digital",
    startDate: "2020-06",
    endDate: "2021-02",
    current: false,
    technologies: ["HTML", "CSS", "JavaScript", "React", "WordPress"],
  },
];
