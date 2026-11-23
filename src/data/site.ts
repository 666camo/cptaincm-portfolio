interface SiteConfig {
  name: string;
  role: readonly [string, string];
  secondaryRole: string;
  location: string;
  email: string;
  instagram: string;
  github?: string;
  linkedin?: string;
  resume?: string;
  navigation: { label: string; href: string }[];
}

export const site: SiteConfig = {
  name: 'Alif Rifky',
  role: ['Full Stack', 'Developer'],
  secondaryRole: 'Creative Problem Solver',
  location: 'Bandung, Indonesia',
  email: 'pratamaalifrifky@gmail.com',
  instagram: 'https://www.instagram.com/cptaincm/',
  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Toolkit', href: '#stack' },
    { label: 'Experience', href: '#experience' },
    { label: 'Activity', href: '#activity' },
    { label: 'Contact', href: '#contact' },
  ],
};
