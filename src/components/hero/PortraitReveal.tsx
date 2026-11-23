import { useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { portraits } from '../../data/portraits';
import { trackBounds } from './trackBounds';
import useReducedMotion from '../../hooks/useReducedMotion';
import { OpeningDeadline } from '../motion/OpeningDeadline';
import { createRevealMask, TRAIL_LIFETIME } from './revealMask';
import type { TrailPoint } from './revealMask';

interface Point { x: number; y: number; time: number }
interface Rect { x: number; y: number; width: number; height: number }

const INTRO_MS = 1220;
const INTRO_HOLD = .33;
const ASSET = { width: 2048, height: 1364 };
const CROP = { x: .235, y: .21, width: .55, height: .79 };
// Register the suit to the real portrait around the face while keeping the suit's proportions.
const MILES = {
  scale: 1.04,
  face: { x: 1000, y: 640 },
  offset: { x: 30, y: 20 },
};

const hoverInput = window.matchMedia('(hover: hover) and (pointer: fine)');
const canHover = () => hoverInput.matches;
const onInputChange = (notify: () => void) => {
  hoverInput.addEventListener('change', notify);
  return () => hoverInput.removeEventListener('change', notify);
};

export default function PortraitReveal() {
  const { theme } = useTheme();
  const assets = portraits[theme];
  const hasHover = useSyncExternalStore(onInputChange, canHover);
  const [showSuit, setShowSuit] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const realRef = useRef<HTMLImageElement>(null);
  const introPlayed = useRef(false);
  const openingTheme = useRef(theme);
  const lastPortrait = useRef(assets.real);
  const reducedMotion = useReducedMotion();
  const openingDeadline = useContext(OpeningDeadline);
  const connection = (navigator as Navigator & { connection?: { saveData: boolean } }).connection;
  const staticMode = reducedMotion || connection?.saveData === true;
  const staticChoice = hasHover && staticMode;
  const alternate = staticChoice && showSuit;

  useEffect(() => {
    const surface = surfaceRef.current;
    const portrait = portraitRef.current;
    const trail = trailRef.current;
    const real = realRef.current;
    const hero = trail?.parentElement;
    const frame = surface?.parentElement;
    if (!surface || !portrait || !trail || !real || !hero || !frame || staticMode || !hasHover) return;
    if (theme !== openingTheme.current) introPlayed.current = true;
    const comic = theme === 'comic';

    const context = portrait.getContext('2d');
    const echo = trail.getContext('2d');
    const layer = document.createElement('canvas');
    const blend = layer.getContext('2d');
    if (!context || !echo || !blend) return;

    const tracked = trackBounds(hero);
    const panel = hero.closest('.stack-panel');
    const isCovered = () => panel?.hasAttribute('data-covered');
    const suit = new Image();
    suit.decoding = 'async';
    suit.fetchPriority = 'low';

    let animation = 0;
    let visible = false;
    let previous: Point | undefined;
    let stamps: TrailPoint[] = [];
    let introStart: number | undefined;
    let mask: ReturnType<typeof createRevealMask> = null;
    let measured: {
      artwork: Rect;
      projection: Rect;
      reachX: number;
      reachY: number;
      stripe: number;
      ink: CanvasGradient | CanvasPattern | string;
    } | undefined;

    const imagesReady = () => real.complete && suit.complete && !!real.naturalWidth && !!suit.naturalWidth;
    const schedule = () => { if (!animation) animation = requestAnimationFrame(draw); };
    const startIntro = () => {
      const deadline = openingDeadline?.current;
      const now = performance.now();
      if (deadline == null || now >= deadline) return;
      if (introPlayed.current || !visible || !imagesReady() || !mask || isCovered()) return;
      introPlayed.current = true;
      introStart = now;
      schedule();
    };

    const clear = () => {
      cancelAnimationFrame(animation);
      animation = 0;
      stamps = [];
      introStart = undefined;
      previous = undefined;
      frame.removeAttribute('data-liquid');
      echo.clearRect(0, 0, trail.width, trail.height);
    };

    const resize = () => {
      const stage = hero.getBoundingClientRect();
      const art = surface.getBoundingClientRect();
      if (!stage.width || !stage.height || !art.width || !art.height) return;

      const pose = {
        x: (art.left - stage.left) / stage.width,
        y: (art.top - stage.top) / stage.height,
        width: art.width / stage.width,
        height: art.height / stage.height,
      };
      // A low-resolution field drives the entire stage. The photo is composited only in its crop.
      const density = Math.min(.65, 360 / hero.clientWidth, 280 / hero.clientHeight);
      trail.width = Math.max(1, Math.round(hero.clientWidth * density));
      trail.height = Math.max(1, Math.round(hero.clientHeight * density));
      const brush = Math.min(116, surface.clientWidth * .12);
      mask = createRevealMask(trail.width, trail.height, brush * density, 19 * density, comic);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25, 640 / surface.clientWidth);
      portrait.width = layer.width = Math.max(1, Math.round(surface.clientWidth * ratio));
      portrait.height = layer.height = Math.max(1, Math.round(surface.clientHeight * ratio));

      const width = portrait.width / pose.width;
      const height = portrait.height / pose.height;
      const reach = brush * 2 + 38;
      let ink: CanvasGradient | CanvasPattern | string;
      if (comic) {
        const tile = document.createElement('canvas');
        tile.width = tile.height = 4;
        const dots = tile.getContext('2d')!;
        dots.fillStyle = '#332c36';
        dots.fillRect(0, 0, 1.5, 1.5);
        ink = echo.createPattern(tile, 'repeat') ?? '#332c36';
      } else {
        ink = echo.createLinearGradient(0, 0, trail.width, 0);
        ink.addColorStop(0, '#563044');
        ink.addColorStop(.55, '#393554');
        ink.addColorStop(1, '#353962');
      }
      measured = {
        artwork: pose,
        projection: { x: -pose.x * width, y: -pose.y * height, width, height },
        reachX: reach / hero.clientWidth,
        reachY: reach / hero.clientHeight,
        stripe: Math.max(4, Math.round(15 * density)),
        ink,
      };
      frame.removeAttribute('data-liquid');
      startIntro();
      if (introStart !== undefined || stamps.length) schedule();
    };

    const copyPortrait = (target: CanvasRenderingContext2D, image: HTMLImageElement) => {
      const suitLayer = image === suit;
      const scale = suitLayer ? MILES.scale : 1;
      const x = suitLayer ? MILES.offset.x + (1 - scale) * MILES.face.x : 0;
      const y = suitLayer ? MILES.offset.y + (1 - scale) * MILES.face.y : 0;
      target.drawImage(
        image,
        (x / ASSET.width - CROP.x) * portrait.width / CROP.width,
        (y / ASSET.height - CROP.y) * portrait.height / CROP.height,
        portrait.width * scale / CROP.width,
        portrait.height * scale / CROP.height,
      );
    };

    const paintEcho = (field: NonNullable<typeof mask>, view: NonNullable<typeof measured>) => {
      const { width, height } = trail;
      echo.globalCompositeOperation = 'source-over';
      echo.clearRect(0, 0, width, height);
      echo.drawImage(field.surface, 0, 0);
      echo.globalCompositeOperation = 'source-in';
      echo.fillStyle = view.ink;
      echo.fillRect(0, 0, width, height);
      if (comic) return;
      echo.globalCompositeOperation = 'source-atop';
      echo.fillStyle = 'rgba(9, 8, 19, .32)';
      for (let y = 0; y < height; y += view.stripe) {
        echo.fillRect(0, y, width, Math.max(1, view.stripe * .28));
      }
    };

    const paintPortrait = (field: NonNullable<typeof mask>, projection: Rect) => {
      const { width, height } = portrait;
      const { x, y, width: maskWidth, height: maskHeight } = projection;
      // Replace the real layer under the shared field so the transition has a single silhouette.
      context.globalCompositeOperation = 'source-over';
      context.clearRect(0, 0, width, height);
      copyPortrait(context, real);
      context.globalCompositeOperation = 'destination-out';
      context.drawImage(field.surface, x, y, maskWidth, maskHeight);

      blend.globalCompositeOperation = 'source-over';
      blend.clearRect(0, 0, width, height);
      copyPortrait(blend, suit);
      blend.globalCompositeOperation = 'source-atop';
      blend.fillStyle = 'rgba(0, 0, 0, .10)';
      blend.fillRect(0, 0, width, height);
      blend.globalCompositeOperation = 'destination-in';
      blend.drawImage(field.surface, x, y, maskWidth, maskHeight);

      context.globalCompositeOperation = 'lighter';
      context.drawImage(layer, 0, 0);
      context.globalCompositeOperation = 'source-atop';
      context.drawImage(field.rim, x, y, maskWidth, maskHeight);
    };

    function draw(now: number) {
      animation = 0;
      if (!mask || !measured || !visible || isCovered() ||
        context?.isContextLost?.() || blend?.isContextLost?.() || echo?.isContextLost?.()) {
        clear();
        return;
      }

      const intro = introStart === undefined ? undefined : (now - introStart) / INTRO_MS;
      if (intro !== undefined && intro >= 1) introStart = undefined;
      stamps = stamps.filter(stamp => now - stamp.time < TRAIL_LIFETIME);
      if (introStart === undefined && !stamps.length) {
        clear();
        return;
      }

      const { artwork, projection, reachX, reachY } = measured;
      const progress = Math.max(0, Math.min(1, ((intro ?? 0) - INTRO_HOLD) / (1 - INTRO_HOLD)));
      const eased = progress * progress * (3 - 2 * progress);
      const front = introStart === undefined ? undefined :
        (artwork.y + artwork.height * eased) * trail!.height + (eased * 64 - 32);
      mask.write(stamps, now, front);

      if (front === undefined) paintEcho(mask, measured);
      const affectsPortrait = front !== undefined || stamps.some(({ x, y }) =>
        x >= artwork.x - reachX && x <= artwork.x + artwork.width + reachX &&
        y >= artwork.y - reachY && y <= artwork.y + artwork.height + reachY);

      if (affectsPortrait && imagesReady()) {
        paintPortrait(mask, projection);
        frame!.setAttribute('data-liquid', front === undefined ? 'trail' : 'intro');
      } else {
        frame!.removeAttribute('data-liquid');
      }
      schedule();
    }

    const onMove = (event: PointerEvent) => {
      if (!visible || !mask || isCovered() ||
        (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return;
      const box = tracked.get();
      if (!box.width || !box.height) return;
      const point = { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height, time: performance.now() };
      const from = previous && point.time - previous.time < 100 ? previous : point;
      const dx = (point.x - from.x) * box.width;
      const dy = (point.y - from.y) * box.height;
      const distance = Math.hypot(dx, dy);
      if (previous && distance < 1) return;
      const angle = Math.atan2(dy, dx);
      const speed = Math.min(2.1, distance / Math.max(12, point.time - from.time));
      const count = Math.max(1, Math.min(9, Math.ceil(distance / 17)));
      introPlayed.current = true;
      introStart = undefined;
      for (let step = 1; step <= count; step++) {
        const fraction = step / count;
        stamps.push({
          x: from.x + (point.x - from.x) * fraction,
          y: from.y + (point.y - from.y) * fraction,
          time: point.time - (count - step) * 10,
          angle, speed,
        });
      }
      stamps = stamps.slice(-16);
      previous = point;
      schedule();
    };

    const onLeave = () => { previous = undefined; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startIntro();
      else clear();
    });
    const resizeObserver = new ResizeObserver(resize);
    resize();
    observer.observe(hero);
    resizeObserver.observe(hero);
    resizeObserver.observe(surface);
    real.addEventListener('load', startIntro);
    suit.addEventListener('load', startIntro);
    suit.src = assets.reveal;
    portrait.addEventListener('contextlost', clear);
    trail.addEventListener('contextlost', clear);
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);

    return () => {
      clear();
      observer.disconnect();
      resizeObserver.disconnect();
      real.removeEventListener('load', startIntro);
      suit.removeEventListener('load', startIntro);
      tracked.dispose();
      portrait.removeEventListener('contextlost', clear);
      trail.removeEventListener('contextlost', clear);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, [openingDeadline, staticMode, hasHover, assets, theme]);

  return (
    <>
      <canvas ref={trailRef} className="hero__trail" aria-hidden="true"/>
      <div className="hero__portrait-wrap">
        <div className="portrait">
          <div className="portrait__frame">
            <img ref={realRef} className={alternate ? 'portrait__real portrait__real--suit' : 'portrait__real'}
              src={alternate ? assets.reveal : assets.real} {...ASSET}
              alt={alternate ? 'Miles Morales in his Spider-Man suit' : 'Alif Rifky seated and leaning forward'}
              onLoad={event => {
                if (!staticMode && lastPortrait.current !== assets.real) {
                  event.currentTarget.animate([{ opacity: .82 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' });
                }
                lastPortrait.current = assets.real;
              }}
              fetchPriority="high" draggable={false}/>
            <div className="portrait__surface" ref={surfaceRef} aria-hidden="true"
              style={{ left: `${CROP.x * 100}%`, top: `${CROP.y * 100}%`, width: `${CROP.width * 100}%`, height: `${CROP.height * 100}%` }}>
              <canvas ref={portraitRef} className="portrait__canvas"/>
            </div>
          </div>
        </div>
        {staticChoice && (
          <button type="button" className="button button--outline hero__portrait-choice"
            aria-pressed={showSuit} onClick={() => setShowSuit(value => !value)}>Miles portrait</button>
        )}
      </div>
    </>
  );
}
