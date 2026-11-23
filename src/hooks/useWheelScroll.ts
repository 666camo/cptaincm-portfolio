import { useEffect } from 'react';
import type Lenis from 'lenis';

const desktopMotion = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const navigationKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab']);

function attachWheelScroll(Controller: typeof Lenis) {
  const scroll = new Controller({
    autoRaf: false,
    smoothWheel: true,
    syncTouch: false,
    lerp: .24,
    virtualScroll: ({ deltaX, deltaY, event }) =>
      event.type !== 'wheel' || (!event.ctrlKey && Math.abs(deltaY) >= Math.abs(deltaX)),
  });

  let frame = 0;
  const advance = (now: number) => {
    frame = 0;
    if (scroll.isScrolling !== 'smooth') return;
    scroll.raf(now);
    if (scroll.isScrolling === 'smooth') frame = requestAnimationFrame(advance);
  };
  const unsubscribe = scroll.on('virtual-scroll', ({ event, deltaY }) => {
    if (event.type !== 'wheel' || !deltaY || frame || document.hidden) return;
    // Seed the clock before Lenis starts interpolation. Idle time is not animation time.
    scroll.raf(performance.now());
    frame = requestAnimationFrame(advance);
  });

  // Give the browser ownership immediately when a native action interrupts a wheel gesture.
  // Fragment navigation then retains native focus, scroll margins, URL and history restoration.
  const interrupt = () => {
    if (scroll.isScrolling === 'smooth') scroll.scrollTo(window.scrollY, { immediate: true });
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const keydown = (event: KeyboardEvent) => { if (navigationKeys.has(event.key)) interrupt(); };
  const click = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest('a[href^="#"]')) interrupt();
  };
  const visibility = () => { if (document.hidden) interrupt(); };

  window.addEventListener('pointerdown', interrupt, { passive: true, capture: true });
  window.addEventListener('keydown', keydown, true);
  window.addEventListener('click', click, true);
  window.addEventListener('popstate', interrupt);
  window.addEventListener('hashchange', interrupt);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    cancelAnimationFrame(frame);
    unsubscribe();
    window.removeEventListener('pointerdown', interrupt, true);
    window.removeEventListener('keydown', keydown, true);
    window.removeEventListener('click', click, true);
    window.removeEventListener('popstate', interrupt);
    window.removeEventListener('hashchange', interrupt);
    document.removeEventListener('visibilitychange', visibility);
    scroll.destroy();
  };
}

export default function useWheelScroll() {
  useEffect(() => {
    const media = window.matchMedia(desktopMotion);
    let mounted = true;
    let dispose: (() => void) | undefined;
    const configure = () => {
      if (!media.matches) {
        dispose?.();
        dispose = undefined;
        return;
      }
      void import('lenis').then(({ default: Controller }) => {
        if (mounted && media.matches && !dispose) dispose = attachWheelScroll(Controller);
      }).catch(() => { /* The browser continues to handle scrolling if the chunk is unavailable. */ });
    };
    configure();
    media.addEventListener('change', configure);
    return () => {
      mounted = false;
      media.removeEventListener('change', configure);
      dispose?.();
    };
  }, []);
}
