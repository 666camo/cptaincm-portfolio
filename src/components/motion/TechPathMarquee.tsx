import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { animate } from 'motion/mini';
import { technologies, technologyGroups } from '../../data/tech';
import type { Technology } from '../../types/content';
import useReducedMotion from '../../hooks/useReducedMotion';
import TechLogo from '../ui/TechLogo';
import Icon from '../ui/Icon';

// Original MarqueeAlongSvgPath demo, in its 996 × 330 coordinate system.
const path = 'M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5';
const deck = [...technologies, ...technologies];
const fallback = technologyGroups.map(group => group.technologies[0]);
const pathSeconds = 100 / 8;
const cycle = pathSeconds * deck.length / 24; // Match the density of the demo's 24 posters.
const wrapTime = (seconds: number) => cycle + ((seconds % cycle) + cycle) % cycle;

function TechPathItem({ tech }: { tech: Technology }) {
  return <span className="arsenal-carrier" style={{ '--card-brand': tech.brandColor } as CSSProperties}>
    <span className="arsenal-badge" title={tech.name}><TechLogo tech={tech}/></span>
  </span>;
}

export default function TechPathMarquee() {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const [supported] = useState(() => typeof CSS !== 'undefined' &&
    CSS.supports('offset-path', 'path("M0 0L1 1")') && typeof Element.prototype.animate === 'function' &&
    !!window.ResizeObserver && !!window.IntersectionObserver);
  const [paused, setPaused] = useState(false);
  const updatePause = useRef<((paused: boolean) => void) | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!supported || !el) return;
    let scale = 1;
    const fit = (width: number) => {
      // Crop the wings on small screens so the crossing and the artwork stay legible.
      scale = Math.max(.92, width / 996 * 1.12);
      el.style.setProperty('--deck-scale', String(scale));
    };
    fit(el.clientWidth);
    const resize = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
    resize.observe(el);
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.arsenal-carrier'));
    const playback = animate(cards, { offsetDistance: ['0%', '100%', '100%'] }, {
      duration: cycle, times: [0, pathSeconds / cycle, 1], ease: 'linear', repeat: Infinity,
      autoplay: false, delay: index => -cycle * (index + .5) / cards.length,
    });
    playback.time = cycle;
    playback.pause();
    const dispose = () => { resize.disconnect(); playback.cancel(); };
    if (reduced) return dispose;

    const length = el.querySelector('path')!.getTotalLength();
    let visible = false;
    let stopped = false;
    let overCard = false;
    let gesture: { id: number; x: number; y: number; time: number; velocity: number; dragging: boolean } | null = null;
    let frame = 0;
    let previous = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!visible || document.hidden || stopped || gesture?.dragging) {
        playback.pause();
        return;
      }
      const target = overCard ? .3 : 1;
      playback.play();
      // Only ease the playback rate during hover changes and drag release.
      previous = performance.now();
      const settle = (now: number) => {
        const mix = 1 - Math.exp(-Math.max(0, now - previous) / 110);
        previous = now;
        const next = playback.speed + (target - playback.speed) * mix;
        if (Math.abs(next - target) < .015) {
          playback.speed = target;
          frame = 0;
        } else {
          playback.speed = next;
          frame = requestAnimationFrame(settle);
        }
      };
      if (playback.speed !== target) frame = requestAnimationFrame(settle);
    };
    updatePause.current = value => { stopped = value; sync(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(el);

    const down = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, time: e.timeStamp, velocity: 0, dragging: false };
    };
    const move = (e: PointerEvent) => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const dx = e.clientX - gesture.x;
      const dy = e.clientY - gesture.y;
      if (!gesture.dragging) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 5) return;
        if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
        gesture.dragging = true;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = 'true';
        sync();
      }
      const delta = dx / (length * scale) * pathSeconds;
      playback.time = wrapTime(playback.time + delta);
      gesture.velocity = Math.max(-5, Math.min(5, delta * 1000 / Math.max(8, e.timeStamp - gesture.time)));
      gesture.x = e.clientX;
      gesture.y = e.clientY;
      gesture.time = e.timeStamp;
    };
    const finish = (e: PointerEvent) => {
      if (!gesture || e.pointerId !== gesture.id) return;
      const last = gesture;
      gesture = null;
      if (!last.dragging) return;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      playback.speed = e.type === 'pointerup' && e.timeStamp - last.time < 100 ? last.velocity : 0;
      sync();
    };
    const hover = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const next = e.type === 'pointerout' ? e.relatedTarget : e.target;
      const inside = next instanceof Element && el.contains(next) && !!next.closest('.arsenal-badge');
      if (inside !== overCard) { overCard = inside; sync(); }
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerout', hover);
    el.addEventListener('pointerover', hover);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    el.addEventListener('lostpointercapture', finish);
    document.addEventListener('visibilitychange', sync);
    return () => {
      updatePause.current = null;
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerover', hover);
      el.removeEventListener('pointerout', hover);
      el.removeEventListener('lostpointercapture', finish);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      document.removeEventListener('visibilitychange', sync);
      delete el.dataset.dragging;
      dispose();
    };
  }, [supported, reduced]);

  useEffect(() => updatePause.current?.(paused), [paused, reduced]);

  return <div className="arsenal-marquee" data-path={supported}>
    {supported && !reduced && <button className="arsenal-playback" type="button" aria-controls={id}
      aria-label={paused ? 'Resume logo animation' : 'Pause logo animation'} onClick={() => setPaused(value => !value)}>
      <Icon name={paused ? 'play' : 'pause'} size={14}/>{paused ? 'Resume' : 'Pause'}
    </button>}
    <div ref={track} id={id} className="arsenal-track" aria-hidden="true">
      <div className="arsenal-deck" style={{ '--poster-path': `path('${path}')` } as CSSProperties}>
        {supported && <svg width="0" height="0" focusable="false"><path d={path}/></svg>}
        {(supported ? deck : fallback).map((tech, index) => <TechPathItem key={index} tech={tech}/>)}
      </div>
    </div>
  </div>;
}
