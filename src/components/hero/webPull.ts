import { ringControl } from './webPhysics';
import type { Thread, Web } from './webPhysics';

// Select actual junctions once at layout time. Their remaining neighbours stay in the canvas.
export function bindWebPulls(webs: Web[], paths: NodeListOf<SVGPathElement>, width: number, height: number) {
  const targets = [
    { web: webs[0], x: .16, y: .77, lean: 1 },
    { web: webs[1], x: .83, y: .60, lean: -1 },
    { web: webs[0], x: .10, y: .40, lean: -1 },
  ];
  const selected = new Set<Thread>();
  const reach = Math.min(220, Math.max(95, height * .26));
  const knots = targets.map(({ web, x, y, lean }, index) => {
    let nearest = Infinity;
    let joint = web.center;
    for (const node of web.nodes) {
      if (node.fixed || node.x < 0 || node.x > width || node.y < 0 || node.y > height) continue;
      const distance = Math.hypot(node.x - width * x, node.y - height * y);
      if (distance < nearest) {
        nearest = distance;
        joint = node;
      }
    }
    const threads = web.threads.filter(t => t.from === joint || t.to === joint);
    threads.forEach(t => selected.add(t));
    const path = paths[index];
    path.setAttribute('stroke', index === 1 ? '#8296c8' : '#be829b');
    return { web, joint, threads, path, lean, lastOffset: NaN };
  });

  const draw = (edge: number | null, pointerMoved = false) => {
    for (const knot of knots) {
      const { joint, web, threads, path, lean } = knot;
      const gap = edge === null ? reach : edge - (joint.y + joint.dy);
      const t = Math.min(1, Math.abs(gap) / reach);
      const grip = 1 - t * t * (3 - 2 * t);
      const pull = (gap - 3) * grip;
      if (!pointerMoved && pull === knot.lastOffset) continue;
      knot.lastOffset = pull;

      const shiftX = lean * pull * .22;
      let d = '';
      for (const { from, to, ring } of threads) {
        const x = from.x + from.dx + (from === joint ? shiftX : 0);
        const y = from.y + from.dy + (from === joint ? pull : 0);
        const endX = to.x + to.dx + (to === joint ? shiftX : 0);
        const endY = to.y + to.dy + (to === joint ? pull : 0);
        d += `M${x},${y}`;
        if (ring) {
          d += `Q${ringControl(x, endX, web.center.x)},${ringControl(y, endY, web.center.y)} ${endX},${endY}`;
        } else {
          d += `L${endX},${endY}`;
        }
      }
      path.setAttribute('d', d);
      path.setAttribute('stroke-opacity', String(.25 + grip * .73));
      path.setAttribute('stroke-width', String(.85 + grip * .85));
    }
  };

  return { background: webs.map(web => web.threads.filter(t => !selected.has(t))), draw };
}
