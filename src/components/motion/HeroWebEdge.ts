import { createContext } from 'react';

export interface WebEdge {
  y: number | null;
  draw?: (y: number | null) => void;
}

// Only the three attached knots subscribe. Scrolling never schedules a React render.
export const HeroWebEdge = createContext<WebEdge | null>(null);
