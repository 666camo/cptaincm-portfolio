import type { Project } from '../types/content';

export const projects: Project[] = [
  {
    id: 'nexus', slug: 'nexus-dashboard', title: 'Nexus Dashboard', category: 'Analytics Platform',
    summary: 'A dashboard concept that puts performance trends and key metrics in one view.',
    stack: ['React', 'TypeScript', 'Data Viz'], role: 'Design & Development',
    cover: { kind: 'illustration', theme: 'ruby' }, featured: true, isPlaceholder: true, links: {},
    caseStudy: {
      problem: 'A team needs to spot shifts in performance without opening a separate report for each metric.',
      solution: 'A dashboard concept that puts key metrics alongside trend charts, with historical context in the same view.',
    },
    features: ['Overview of key metrics', 'Trend charts with historical context'],
  },
  {
    id: 'orbit', slug: 'orbit-commerce', title: 'Orbit Commerce', category: 'Digital Commerce',
    summary: 'A storefront concept built around browsing collections and comparing products.',
    stack: ['Full Stack', 'UX Design'], role: 'Development',
    cover: { kind: 'illustration', theme: 'indigo' }, featured: false, isPlaceholder: true, links: {},
    features: ['Collection browsing', 'Product comparison'],
  },
  {
    id: 'flow', slug: 'flow-booking', title: 'Flow Booking', category: 'Booking Experience',
    summary: 'A scheduling concept that takes visitors from available times to a booking confirmation.',
    stack: ['Product Design', 'Web App'], role: 'Design & Development',
    cover: { kind: 'illustration', theme: 'sage' }, featured: false, isPlaceholder: true, links: {},
    features: ['Availability by day', 'Booking confirmation'],
  },
];
