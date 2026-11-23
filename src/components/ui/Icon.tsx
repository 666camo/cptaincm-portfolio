import type { SVGProps, ReactNode } from 'react';

type IconName = 'arrow-up-right' | 'arrow-down' | 'arrow-right' | 'menu' | 'x' | 'plus' | 'minus' | 'mail' | 'instagram' | 'github' | 'linkedin' | 'external' | 'spark' | 'mouse' | 'chevron-right' | 'layers' | 'monitor' | 'code' | 'clock' | 'check' | 'play' | 'pause' | 'book' | 'home' | 'person' | 'sun' | 'moon';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, ReactNode> = {
  home: <><path d="m3 10 9-7 9 7M5 9v11h14V9M10 20v-6h4v6" /></>,
  person: <><circle cx="12" cy="7.5" r="3.5"/><path d="M4 21v-2a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v2"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
  moon: <path d="M20.6 13.4A8.8 8.8 0 0 1 10.6 3a9 9 0 1 0 10 10.4Z"/>,
  'arrow-up-right': <><path d="M7 17 17 7M8 7h9v9" /></>,
  'arrow-down': <><path d="M12 4v16M5 13l7 7 7-7" /></>,
  'arrow-right': <><path d="M4 12h16m-7-7 7 7-7 7" /></>,
  menu: <><path d="M4 8h16M4 16h16" /></>,
  x: <><path d="M5 5 19 19M19 5 5 19" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <><path d="M5 12h14" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  github: <><path d="M9 19c-4 1.2-4-2-6-2m12 4v-3.3a3 3 0 0 0-.9-2.3c3-.35 6.1-1.45 6.1-6.6a5.1 5.1 0 0 0-1.4-3.5 4.6 4.6 0 0 0-.1-3.5S16.7 2 14.6 4a13 13 0 0 0-5.2 0C7.3 2 5.3 2 5.3 2a4.6 4.6 0 0 0-.1 3.5 5.1 5.1 0 0 0-1.4 3.5c0 5.15 3.1 6.25 6.1 6.6a3 3 0 0 0-.9 2.3V21" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7.4h.01M12 17v-7h3a3 3 0 0 1 3 3v4" /></>,
  external: <><path d="M10 5H5v14h14v-5M13 5h6v6M19 5l-9 9" /></>,
  spark: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" /></>,
  mouse: <><rect x="6" y="2" width="12" height="20" rx="6" /><path d="M12 6v4" /></>,
  'chevron-right': <><path d="m9 18 6-6-6-6" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5m-18 5 9 5 9-5" /></>,
  monitor: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 22h8m-4-4v4" /></>,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-3 16" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" /></>,
  check: <><path d="m4 12 5 5L20 6" /></>,
  play: <><path d="m8 5 11 7-11 7V5Z" /></>,
  pause: <><path d="M8 5v14M16 5v14" /></>,
  book: <><path d="M12 6v15m0-15C9.5 4 6 3.5 3 4.5v14c3-1 6.5-.5 9 2.5 2.5-3 6-3.5 9-2.5v-14C18 3.5 14.5 4 12 6Z" /></>,
};

export default function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
