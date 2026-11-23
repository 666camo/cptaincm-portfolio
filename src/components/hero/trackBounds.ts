// The sticky stack moves and scales the Hero as the page scrolls.
// Share a cached viewport rectangle with each pointer handler.
export function trackBounds(element: Element) {
  let rect = element.getBoundingClientRect();
  let frame = 0;
  const refresh = () => {
    frame = 0;
    rect = element.getBoundingClientRect();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(refresh);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(element);
  window.addEventListener('scroll', schedule, { passive: true });
  return {
    get: () => rect,
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
    },
  };
}
