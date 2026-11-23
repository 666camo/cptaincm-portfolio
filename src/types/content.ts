export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  stack: string[];
  role: string;
  cover:
    | { kind: 'illustration'; theme: 'ruby' | 'indigo' | 'sage' }
    | { kind: 'image'; src: string; alt: string; width: number; height: number };
  features: string[];
  featured: boolean;
  caseStudy?: { problem: string; solution: string };
  isPlaceholder: boolean;
  links: { demo?: string; source?: string };
}

export interface Technology {
  logo: string;
  name: string;
  brandColor: string;
}

export interface TechnologyGroup {
  id: string;
  title: string;
  technologies: Technology[];
}

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  organization: string;
  description: string;
  isPlaceholder: boolean;
}
