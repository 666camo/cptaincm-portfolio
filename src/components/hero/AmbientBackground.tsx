import { useEffect, useRef } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import SpiderWeb from './SpiderWeb';

export default function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  useEffect(() => {
    const background = ref.current;
    if (!background) return;
    const observer = new IntersectionObserver(([entry]) =>
      background.toggleAttribute('data-offscreen', !entry.isIntersecting));
    observer.observe(background);
    return () => observer.disconnect();
  }, []);

  return <div className="hero-ambience" aria-hidden="true" ref={ref}>
    <div className="hero-ambience__glow hero-ambience__glow--warm"/>
    <div className="hero-ambience__glow hero-ambience__glow--cool"/>
    <svg className="hero-ambience__contours" viewBox="0 0 1100 950" preserveAspectRatio="xMidYMid slice" fill="none">
      {Array.from({ length: 13 }, (_,i) => {
        const r = 145 + i * 42;
        return <path key={i} d={`M${550-r} 1020 Q${550-r*.9} ${470-r*.45} 550 ${480-r} Q${550+r*.9} ${470-r*.45} ${550+r} 1020`} stroke="currentColor" strokeWidth={i%3===0?'1.2':'.7'}/>;
      })}
    </svg>
    <div className="hero-ambience__vignette" />
    {theme === 'dark' ? <SpiderWeb /> : (
      <div className="hero-ambience__print" />
    )}
  </div>;
}
