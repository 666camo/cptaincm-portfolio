interface Position { x: number; y: number }
interface Joint extends Position {
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  forceX: number;
  forceY: number;
  fixed: boolean;
}
export interface Thread { from: Joint; to: Joint; ring: boolean }

const spokes = 15;
const rings = 11;

export function buildWeb(x: number, y: number, radius: number, rotation: number, color: string) {
  const joint = (x: number, y: number, fixed: boolean): Joint =>
    ({ x, y, dx: 0, dy: 0, vx: 0, vy: 0, forceX: 0, forceY: 0, fixed });

  const center = joint(x, y, true);
  const nodes = [center];
  const threads: Thread[] = [];
  const rows = Array.from({ length: rings }, (_, row) => {
    const fraction = Math.pow((row + 1) / rings, 1.40);
    return Array.from({ length: spokes }, (_, index) => {
      const angle = index / spokes * Math.PI * 2 + rotation + Math.sin(index * 2.3) * .07;
      const length = radius * fraction * (1 + Math.cos(index * 1.8 + rotation) * .12);
      const node = joint(x + Math.cos(angle) * length, y + Math.sin(angle) * length, row === rings - 1);
      nodes.push(node);
      return node;
    });
  });
  rows.forEach((row, rowIndex) => row.forEach((node, index) => {
    threads.push({ from: rowIndex ? rows[rowIndex - 1][index] : center, to: node, ring: false });
    threads.push({ from: node, to: row[(index + 1) % spokes], ring: true });
  }));
  return { nodes, threads, center, color };
}

export type Web = ReturnType<typeof buildWeb>;

export function ringControl(start: number, end: number, center: number) {
  return (start + end) * .455 + center * .09;
}

export function stepWeb(web: Web, pointer: Position | undefined, pressure: number, dt: number) {
  const damping = Math.pow(.86, dt * 60);
  let active = false;
  for (const node of web.nodes) {
    const dx = node.x - (pointer?.x ?? 0);
    const dy = node.y - (pointer?.y ?? 0);
    const distance = Math.hypot(dx, dy);
    const falloff = pressure * Math.pow(Math.max(0, 1 - distance / 158), 1.6);
    node.forceX = -51 * node.dx + dx * falloff * 46;
    node.forceY = -51 * node.dy + dy * falloff * 46 + falloff * 790;
  }
  for (const { from, to } of web.threads) {
    const pullX = (to.dx - from.dx) * 79;
    const pullY = (to.dy - from.dy) * 79;
    from.forceX += pullX;
    to.forceX -= pullX;
    from.forceY += pullY;
    to.forceY -= pullY;
  }
  for (const node of web.nodes) {
    if (node.fixed) continue;
    node.vx = (node.vx + node.forceX * dt) * damping;
    node.vy = (node.vy + node.forceY * dt) * damping;
    node.dx += node.vx * dt;
    node.dy += node.vy * dt;
    if (Math.abs(node.dx) + Math.abs(node.dy) + Math.abs(node.vx) * .08 + Math.abs(node.vy) * .08 > .13) active = true;
  }
  if (!active) {
    for (const node of web.nodes) node.dx = node.dy = node.vx = node.vy = 0;
  }
  return active;
}

export function drawWeb(ctx: CanvasRenderingContext2D, web: Web, threads = web.threads) {
  ctx.strokeStyle = web.color;
  ctx.lineWidth = .85;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (const { from, to, ring } of threads) {
    const x = from.x + from.dx;
    const y = from.y + from.dy;
    const endX = to.x + to.dx;
    const endY = to.y + to.dy;
    ctx.moveTo(x, y);
    if (ring) {
      ctx.quadraticCurveTo(ringControl(x, endX, web.center.x), ringControl(y, endY, web.center.y), endX, endY);
    } else ctx.lineTo(endX, endY);
  }
  ctx.stroke();
}
