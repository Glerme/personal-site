export interface Project {
  id: string;
  tags: string[];
  category: ProjectCategory;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  year: number;
}

export type ProjectCategory =
  | "fullstack"
  | "frontend"
  | "backend"
  | "mobile"
  | "devops";

export interface SkillCategory {
  id: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  icon?: string;
}

export type EmploymentType = "full-time" | "freelance" | "part-time" | "internship";

export interface Experience {
  id: string;
  company: string;
  companyUrl?: string;
  employmentType?: EmploymentType;
  startDate: string;
  endDate?: string;
  current: boolean;
  technologies: string[];
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  cvUrl?: string;
  avatarUrl?: string;
  socialLinks: SocialLink[];
}

export type NavSection =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "contact";
