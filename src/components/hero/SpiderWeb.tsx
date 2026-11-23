import { useContext, useEffect, useRef } from 'react';
import { HeroWebEdge } from '../motion/HeroWebEdge';
import { bindWebPulls } from './webPull';
import useReducedMotion from '../../hooks/useReducedMotion';
import { buildWeb, drawWeb, stepWeb } from './webPhysics';
import { trackBounds } from './trackBounds';

export default function SpiderWeb() {
  const ref = useRef<HTMLCanvasElement>(null);
  const detail = useRef<SVGSVGElement>(null);
  const webEdge = useContext(HeroWebEdge);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const hero = canvas?.closest<HTMLElement>('.hero');
    const context = canvas?.getContext('2d');
    if (!canvas || !hero || !context) return;

    const paths = detail.current?.querySelectorAll('path');
    let pulls: ReturnType<typeof bindWebPulls> | undefined;
    const drawEdge = (y: number | null) => pulls?.draw(y);
    if (webEdge && !reducedMotion) webEdge.draw = drawEdge;
    const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const colors = getComputedStyle(canvas);
    const red = colors.getPropertyValue('--web-red').trim();
    const blue = colors.getPropertyValue('--web-blue').trim();
    let webs: ReturnType<typeof buildWeb>[] = [];
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number; time: number } | undefined;
    let request = 0;
    let lastTime = 0;
    let visible = false;

    const paint = () => {
      context.clearRect(0, 0, width, height);
      webs.forEach((web, i) => drawWeb(context, web, pulls?.background[i]));
      pulls?.draw(webEdge?.y ?? null, true);
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      const span = Math.max(width * .54, height * .64);
      webs = [
        buildWeb(width * .08, height * .37, span, .15, red),
        buildWeb(width * .90, height * .30, span * .91, .43, blue),
      ];
      if (paths?.length && webEdge && !reducedMotion) {
        pulls = bindWebPulls(webs, paths, width, height);
      }
      paint();
    };

    const tick = (now: number) => {
      request = 0;
      if (!visible) return;
      if (hero.closest('[data-covered]')) {
        pointer = undefined;
        lastTime = 0;
        resize();
        return;
      }
      const dt = lastTime ? Math.min(.03, (now - lastTime) / 1000) : 1 / 60;
      lastTime = now;
      const pressure = pointer ? Math.max(0, 1 - (now - pointer.time) / 430) : 0;
      const active = webs.map(web => stepWeb(web, pointer, pressure, dt)).some(Boolean);
      paint();
      if (active) request = requestAnimationFrame(tick);
      else lastTime = 0;
    };

    let tracked: ReturnType<typeof trackBounds> | undefined;
    const updateInput = () => {
      tracked?.dispose();
      tracked = !reducedMotion && finePointer.matches ? trackBounds(canvas) : undefined;
    };
    updateInput();
    finePointer.addEventListener('change', updateInput);
    const move = (event: PointerEvent) => {
      if (!visible || !finePointer.matches || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
      const bounds = tracked?.get();
      if (!bounds?.width || !bounds.height) return;
      pointer = {
        x: (event.clientX - bounds.left) * width / bounds.width,
        y: (event.clientY - bounds.top) * height / bounds.height,
        time: performance.now(),
      };
      if (!request) request = requestAnimationFrame(tick);
    };

    const leave = () => { pointer = undefined; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(request);
        request = 0;
        lastTime = 0;
        pointer = undefined;
        resize();
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    resize();
    if (!reducedMotion) {
      hero.addEventListener('pointermove', move, { passive: true });
      hero.addEventListener('pointerleave', leave);
    }

    return () => {
      cancelAnimationFrame(request);
      if (webEdge?.draw === drawEdge) delete webEdge.draw;
      finePointer.removeEventListener('change', updateInput);
      tracked?.dispose();
      observer.disconnect();
      resizeObserver.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  }, [reducedMotion, webEdge]);

  return <>
    <canvas ref={ref} className="hero-ambience__web" aria-hidden="true"/>
    {!reducedMotion && <svg ref={detail} className="hero-ambience__knots" aria-hidden="true" fill="none" strokeLinejoin="round">
      <path/><path/><path/>
    </svg>}
  </>;
}
