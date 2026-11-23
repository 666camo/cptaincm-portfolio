import { useEffect, useRef } from 'react';
import type { FocusEvent } from 'react';
import Hero from '../../sections/Hero';
import About from '../../sections/About';
import Projects from '../../sections/Projects';
import { HeroWebEdge } from './HeroWebEdge';
import type { WebEdge } from './HeroWebEdge';

const STACK_MEDIA = '(prefers-reduced-motion: no-preference)';
const PHONE_MEDIA = '(max-width: 639px)';

function StackSeam() {
  return (
    <div className="stack-seam" aria-hidden="true">
      <span/><span/><span/>
    </div>
  );
}

export default function StackSequence() {
  const webEdge = useRef<WebEdge>({ y: null }).current;
  const stackRef = useRef<HTMLDivElement>(null);
  const homeAnchor = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const aboutAnchor = useRef<HTMLDivElement>(null);
  const projectsAnchor = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    const hero = heroRef.current;
    const about = aboutRef.current;
    const projects = projectsRef.current;
    const aboutStart = aboutAnchor.current;
    const projectsStart = projectsAnchor.current;
    if (!stack || !hero || !about || !projects || !aboutStart || !projectsStart) return;

    const media = window.matchMedia(STACK_MEDIA);
    const phone = window.matchMedia(PHONE_MEDIA);
    const transitions = [
      { outgoing: hero, incoming: about, anchor: aboutStart },
      { outgoing: about, incoming: projects, anchor: projectsStart },
    ];
    let frame = 0;
    let previousReadProgress = -1;

    const update = () => {
      frame = 0;
      const viewport = Math.max(1, window.innerHeight);
      const active = media.matches;
      const shrink = phone.matches ? 0 : .10;
      const positions = transitions.map(({ anchor, outgoing }) => ({
        nextTop: anchor.getBoundingClientRect().top,
        panelHeight: outgoing.offsetHeight,
      }));
      stack.dataset.sticky = String(active);

      // The extra distance keeps About pinned while the reader advances through the bio.
      const aboutTop = positions[0].nextTop;
      const readingDistance = positions[1].nextTop - aboutTop - positions[1].panelHeight;
      const leadIn = viewport * .19;
      const readProgress = active && readingDistance > 0
        ? Math.max(0, Math.min(1, (leadIn - aboutTop) / (leadIn + readingDistance * .88)))
        : 1;
      if (readProgress !== previousReadProgress) {
        about.style.setProperty('--bio-progress', String(readProgress));
        previousReadProgress = readProgress;
      }

      transitions.forEach(({ outgoing, incoming }, index) => {
        const { nextTop, panelHeight } = positions[index];
        const progress = active ? Math.max(0, Math.min(1, 1 - nextTop / viewport)) : 0;
        // Taller panels remain scrollable and pin only after their lower content is visible.
        outgoing.style.setProperty('--stack-top', `${Math.min(0, viewport - panelHeight)}px`);
        outgoing.style.setProperty('--stack-scale', String(1 - progress * shrink));
        outgoing.style.setProperty('--stack-dim', String(progress * .55));
        outgoing.toggleAttribute('data-covered', progress >= 1);
        incoming.style.setProperty('--stack-seam', String(Math.sin(progress * Math.PI)));
        if (incoming === about) {
          // During the overlap the bottom of the unscaled Hero is pinned to the viewport.
          // Invert its center-origin scale to place the panel edge in web coordinates.
          const center = panelHeight / 2;
          const y = progress > 0 && progress < 1
            ? center + (center - progress * viewport) / (1 - progress * shrink)
            : null;
          if (webEdge.y !== y) {
            webEdge.y = y;
            webEdge.draw?.(y);
          }
        } else {
          incoming.style.setProperty('--stack-seam-slack', String(1 - progress * .90));
        }
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(hero);
    observer.observe(about);
    observer.observe(stack);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', schedule);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', schedule);
    };
  }, [webEdge]);

  const keepFocusVisible = (event: FocusEvent<HTMLElement>, anchor: HTMLElement | null, next: HTMLElement | null) => {
    if (stackRef.current?.dataset.sticky !== 'true' || !next) return;
    if (event.target.getBoundingClientRect().bottom > next.getBoundingClientRect().top) {
      anchor?.scrollIntoView();
    }
  };

  return (
    <div className="stack-sequence" ref={stackRef}>
      <div className="stack-anchor" id="home" tabIndex={-1} role="group" aria-labelledby="hero-title" ref={homeAnchor}/>
      <section className="stack-panel stack-panel--hero" aria-labelledby="hero-title" ref={heroRef}
        onFocusCapture={event => keepFocusVisible(event, homeAnchor.current, aboutAnchor.current)}>
        <div className="stack-panel__surface">
          <HeroWebEdge.Provider value={webEdge}><Hero /></HeroWebEdge.Provider>
          <div className="stack-panel__dim" aria-hidden="true"/>
        </div>
      </section>
      <div className="stack-anchor" id="about" tabIndex={-1} role="group" aria-labelledby="about-title" ref={aboutAnchor}/>
      <section className="stack-panel stack-panel--about" aria-labelledby="about-title" ref={aboutRef}
        onFocusCapture={event => keepFocusVisible(event, aboutAnchor.current, projectsAnchor.current)}>
        <div className="about-edge" aria-hidden="true" />
        <div className="stack-panel__surface">
          <About />
          <div className="stack-panel__dim" aria-hidden="true"/>
        </div>
      </section>
      <div className="about-read-space" aria-hidden="true"/>
      <div className="stack-anchor" id="projects" tabIndex={-1} role="group" aria-labelledby="projects-title" ref={projectsAnchor}/>
      <section className="stack-panel stack-panel--projects" aria-labelledby="projects-title" ref={projectsRef}>
        <StackSeam />
        <Projects />
      </section>
    </div>
  );
}
