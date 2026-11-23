import { useEffect } from 'react';
import type { RefObject } from 'react';
import useReducedMotion from './useReducedMotion';

export default function useSectionEntrance(ref: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = ref.current;
    if (!section || reducedMotion) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(({ target }, index) => {
        observer.unobserve(target);
        const headline = target.getAttribute('data-entrance') === 'headline';
        const animation = target.animate([
          { transform: `translateY(${headline ? 23 : 14}px)`, opacity: headline ? .68 : .83 },
          { transform: 'translateY(0)', opacity: 1 },
        ], {
          delay: Math.min(index * 55, 165),
          duration: headline ? 620 : 500,
          easing: 'cubic-bezier(.22,1,.36,1)',
        });
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); };
      });
    }, { threshold: .12 });
    section.querySelectorAll('[data-entrance]').forEach(item => observer.observe(item));
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
    };
  }, [reducedMotion, ref]);
}
