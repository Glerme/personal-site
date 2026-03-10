import type {
  PersonalInfo,
  Project,
  SkillCategory,
  Experience,
} from "@/types/portfolio.types";

export const personalInfo: PersonalInfo = {
  name: "Guilherme Felipe",
  email: "guiggff@gmail.com",
  cvUrl:
    "https://drive.google.com/file/d/1G9Dz9rOzSUAsO85R6Zz-RWWKTjr-o15x/view?usp=sharing",
  avatarUrl: undefined,
  socialLinks: [
    { label: "GitHub", url: "https://github.com/glerme", icon: "github" },
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/glerme",
      icon: "linkedin",
    },
    { label: "Twitter", url: "https://x.com/Gleerme", icon: "twitter" },
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
      { name: "React", icon: "SiReact" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "Next.js", icon: "SiNextdotjs" },
      { name: "TailwindCSS", icon: "SiTailwindcss" },
      { name: "Vite", icon: "SiVite" },
      { name: "Zustand" },
      { name: "TanStack Query", icon: "SiReactquery" },
      { name: "Framer Motion", icon: "SiFramer" },
    ],
  },
  {
    id: "backend",
    skills: [
      { name: "Node.js", icon: "SiNodedotjs" },
      { name: "Fastify", icon: "SiFastify" },
      { name: "Express", icon: "SiExpress" },
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "Prisma", icon: "SiPrisma" },
      { name: "Redis", icon: "SiRedis" },
      { name: "REST APIs" },
      { name: "GraphQL", icon: "SiGraphql" },
    ],
  },
  {
    id: "devops",
    skills: [
      { name: "Docker", icon: "SiDocker" },
      { name: "GitHub Actions", icon: "SiGithubactions" },
      { name: "Vercel", icon: "SiVercel" },
      { name: "AWS" },
      { name: "Linux", icon: "SiLinux" },
      { name: "Nginx", icon: "SiNginx" },
    ],
  },
  {
    id: "tools",
    skills: [
      { name: "Git", icon: "SiGit" },
      { name: "Neovim", icon: "SiNeovim" },
      { name: "Figma", icon: "SiFigma" },
      { name: "Vitest", icon: "SiVitest" },
      { name: "Playwright" },
      { name: "Zod", icon: "SiZod" },
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
