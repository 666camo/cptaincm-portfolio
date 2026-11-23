import { createContext } from 'react';
import type { RefObject } from 'react';

export const OpeningDeadline = createContext<RefObject<number | null> | null>(null);
