import { site } from './site';

interface AboutContent {
  introduction: string;
  example?: { text: string; link?: { href: string; label: string } };
  isPlaceholder: boolean;
}

export const about: AboutContent = {
  introduction: `Hi, I’m ${site.name}. I’m a ${site.role.join(' ').toLowerCase()} from ${site.location}. I care about how a website works and how it feels. Here, that shows up in small details, like a spiderweb that bends under your cursor.`,
  isPlaceholder: false,
};
