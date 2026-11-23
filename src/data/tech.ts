import type { TechnologyGroup } from '../types/content';

export const technologyGroups: TechnologyGroup[] = [
  { id: 'backend', title: 'Backend Core', technologies: [
    { logo: 'go', name: 'Go', brandColor: '#00add8' },
    { logo: 'java', name: 'Java', brandColor: '#e76f00' },
    { logo: 'springboot', name: 'Spring Boot', brandColor: '#6db33f' },
    { logo: 'springsecurity', name: 'Spring Security', brandColor: '#6db33f' },
    { logo: 'jsonwebtokens', name: 'JWT', brandColor: '#d63aff' },
  ] },
  { id: 'data', title: 'Data & Messaging', technologies: [
    { logo: 'postgresql', name: 'PostgreSQL', brandColor: '#4169a1' },
    { logo: 'mysql', name: 'MySQL', brandColor: '#4479a1' },
    { logo: 'redis', name: 'Redis', brandColor: '#d82c20' },
    { logo: 'rabbitmq', name: 'RabbitMQ', brandColor: '#ff6600' },
  ] },
  { id: 'runtime', title: 'Runtime & Tooling', technologies: [
    { logo: 'docker', name: 'Docker', brandColor: '#2496ed' },
    { logo: 'nodedotjs', name: 'Node.js', brandColor: '#5fa04e' },
    { logo: 'express', name: 'Express', brandColor: '#888888' },
    { logo: 'git', name: 'Git', brandColor: '#f05032' },
  ] },
  { id: 'frontend', title: 'Frontend', technologies: [
    { logo: 'react', name: 'React', brandColor: '#39bfe8' },
    { logo: 'typescript', name: 'TypeScript', brandColor: '#3178c6' },
    { logo: 'javascript', name: 'JavaScript', brandColor: '#f7df1e' },
    { logo: 'tailwindcss', name: 'Tailwind CSS', brandColor: '#06b6d4' },
  ] },
];

export const technologies = technologyGroups.flatMap(group => group.technologies);
export const workflow = [
  { name: 'C', use: 'Logic & Algorithms' },
  { name: 'Postman', use: 'API Testing' },
  { name: 'Git Flow', use: 'Branching Workflow' },
];
