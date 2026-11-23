import type { CSSProperties } from 'react';
import type { Technology } from '../../types/content';

export default function TechLogo({ tech }: { tech: Technology }) {
  const style = {
    '--logo': `url("${import.meta.env.BASE_URL}assets/tech/${tech.logo}.svg")`,
    '--brand-color': tech.brandColor,
  } as CSSProperties;
  return <span className="arsenal-logo" aria-hidden="true" style={style} />;
}
