import { useCallback, useContext, useEffect, useState } from 'react';
import Wordmark from '../ui/Wordmark';
import useReducedMotion from '../../hooks/useReducedMotion';
import { portraits } from '../../data/portraits';
import { useTheme } from '../../app/ThemeProvider';
import { OpeningDeadline } from './OpeningDeadline';

const MAX_OPENING_MS = 720;

export default function IntroLoader() {
  const { theme } = useTheme();
  const [openingPortrait] = useState(() => portraits[theme].real);
  const reducedMotion = useReducedMotion();
  const openingDeadline = useContext(OpeningDeadline);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const dismiss = useCallback(() => {
    if (openingDeadline) openingDeadline.current = null;
    setVisible(false);
  }, [openingDeadline]);

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      dismiss();
      return;
    }

    if (openingDeadline) openingDeadline.current = performance.now() + MAX_OPENING_MS;
    const image = new Image();
    const timer = window.setTimeout(dismiss, MAX_OPENING_MS);
    const finish = () => setReady(true);
    image.addEventListener('load', finish);
    image.addEventListener('error', finish);
    image.src = openingPortrait;
    if (image.complete) finish();

    return () => {
      clearTimeout(timer);
      if (openingDeadline) openingDeadline.current = null;
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
    };
  }, [dismiss, openingDeadline, openingPortrait, reducedMotion, visible]);

  if (reducedMotion || !visible) return null;
  return (
    <div className={`intro-loader ${ready ? 'intro-loader--done' : ''}`} aria-hidden="true"
      onAnimationEnd={dismiss}>
      <Wordmark />
    </div>
  );
}
