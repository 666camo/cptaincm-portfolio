export interface TrailPoint {
  x: number;
  y: number;
  time: number;
  angle: number;
  speed: number;
}

export const TRAIL_LIFETIME = 500;

export function createRevealMask(width: number, height: number, brushRadius: number, speedRadius: number, comic: boolean) {
  const surface = document.createElement('canvas');
  const rim = document.createElement('canvas');
  surface.width = rim.width = width;
  surface.height = rim.height = height;
  const mask = surface.getContext('2d');
  const rimContext = rim.getContext('2d');
  if (!mask || !rimContext) return null;

  const alpha = mask.createImageData(width, height);
  const edge = rimContext.createImageData(width, height);
  const distance = new Float32Array(width * height);
  const noise = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      noise[i] = Math.sin(x * .094 + Math.cos(y * .069) * 2) * 3.2
        + Math.sin(y * .118 + Math.cos(x * .128) * 1.6) * 2.2
        + Math.sin(x * .31 + y * .18) * 1.4;
      edge.data[i * 4] = comic ? 30 : 255;
      edge.data[i * 4 + 1] = comic ? 27 : 75;
      edge.data[i * 4 + 2] = comic ? 33 : 107;
    }
  }

  const write = (points: TrailPoint[], now: number, wipe?: number) => {
    distance.fill(-100);
    if (wipe === undefined) {
      for (const point of points) {
        const life = Math.max(0, Math.min(1, 1 - (now - point.time) / TRAIL_LIFETIME));
        if (!life) continue;
        const x = point.x * width;
        const y = point.y * height;
        const radius = (brushRadius + point.speed * speedRadius) * Math.pow(life, .57);
        const reach = radius * (1.10 + point.speed * .32);
        const sin = Math.sin(point.angle);
        const cos = Math.cos(point.angle);
        const scale = radius / reach;
        const bound = reach + 10;
        for (let j = Math.max(0, Math.floor(y - bound)); j < Math.min(height, y + bound); j++) {
          for (let i = Math.max(0, Math.floor(x - bound)); i < Math.min(width, x + bound); i++) {
            const dx = i - x;
            const dy = j - y;
            const along = (dx * cos + dy * sin) * scale;
            const across = dy * cos - dx * sin;
            const index = j * width + i;
            distance[index] = Math.max(distance[index], radius - Math.sqrt(along * along + across * across));
          }
        }
      }
    }

    const drift = comic ? 0 : Math.floor(now * .027) % width;
    const rimWidth = comic ? 1.65 : wipe === undefined ? 3.2 : 9;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const index = j * width + i;
        const variation = noise[j * width + ((i + drift) % width)];
        const signed = wipe === undefined
          ? distance[index] + variation
          : j - wipe + variation * 2.9 + Math.sin(i * .044) * height * .021;
        const coverage = Math.max(0, Math.min(1, .5 + signed / 2.4));
        alpha.data[index * 4 + 3] = coverage * 255;
        const rimAlpha = 1 - Math.min(1, Math.abs(signed) / rimWidth);
        edge.data[index * 4 + 3] = rimAlpha * rimAlpha * (comic ? 210 : wipe === undefined ? 92 : 230);
      }
    }
    mask.putImageData(alpha, 0, 0);
    rimContext.putImageData(edge, 0, 0);
  };

  return { surface, rim, write };
}
