import { useEffect, useState } from 'react';
import { site } from '../data/site';

export default function useActiveSection() {
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const sections = site.navigation.flatMap(({ href }) => {
      const element = document.getElementById(href.slice(1));
      return element ? [{ href, element, top: 0 }] : [];
    });
    let previous = '';
    let boundary = 0;

    const update = () => {
      const position = window.scrollY + boundary;
      let current = '#home';
      for (const section of sections) {
        if (section.top > position) break;
        current = section.href;
      }
      if (current !== previous) {
        previous = current;
        setActive(current);
      }
    };

    // The first three targets are flow anchors, independent of their pinned panels.
    const measure = () => {
      boundary = Math.min(window.innerHeight * .4, 260);
      for (const section of sections) {
        section.top = section.element.getBoundingClientRect().top + window.scrollY;
      }
      update();
    };
    const observer = new ResizeObserver(measure);
    const stack = document.querySelector('.stack-sequence');
    if (stack) observer.observe(stack);
    for (const { element } of sections) {
      observer.observe(element.classList.contains('stack-anchor') ? element.nextElementSibling ?? element : element);
    }
    measure();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return active;
}
