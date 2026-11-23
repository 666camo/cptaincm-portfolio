import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../../app/ThemeProvider';
import { site } from '../../data/site';
import useActiveSection from '../../hooks/useActiveSection';
import Icon from '../ui/Icon';
import type { IconProps } from '../ui/Icon';
import Wordmark from '../ui/Wordmark';


interface DockItemProps {
  label: string;
  icon: IconProps['name'];
  href?: string;
  external?: boolean;
  current?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  variant?: 'home' | 'contact' | 'social' | 'theme';
}

function DockItem({ label, icon, href, external, current, onClick, actionLabel = label, variant }: DockItemProps) {
  const tooltipId = useId();
  const available = Boolean(href || onClick);
  const props = { className: 'dock__control', 'aria-label': actionLabel, 'aria-describedby': tooltipId };
  const content = <>
    <span className="dock__glyph" aria-hidden="true">
      {variant === 'home' && <span className="dock__monogram">c<span>.</span></span>}
      <Icon name={icon} size={21}/>
    </span>
    <span className="dock__caption" aria-hidden="true">{label}</span>
  </>;
  let control: ReactNode;
  if (onClick) {
    control = <button type="button" {...props} onClick={onClick}>{content}</button>;
  } else if (href) {
    control = <a href={href} {...props} aria-current={current ? 'location' : undefined}
      target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{content}</a>;
  } else {
    control = <span {...props} role="link" aria-disabled="true" tabIndex={0}>{content}</span>;
  }
  return <li className="dock__item" data-variant={variant}
    onPointerEnter={e => e.currentTarget.removeAttribute('data-dismissed')}
    onFocusCapture={e => e.currentTarget.removeAttribute('data-dismissed')}>
    {control}
    <span className="dock__tooltip" id={tooltipId} role="tooltip">
      {available ? actionLabel : `${label} · Coming soon`}
    </span>
  </li>;
}

const icons: Partial<Record<string, IconProps['name']>> = {
  '#home': 'home', '#about': 'person', '#projects': 'layers', '#contact': 'mail',
};

const compactScreen = '(max-width:899px), (pointer:coarse) and (max-height:500px)';
const bandungTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function BandungClock({ visible }: { visible: boolean }) {
  const [time, setTime] = useState(() => bandungTime.format(new Date()));
  useEffect(() => {
    if (!visible) return;
    let timer: number;
    function tick() {
      window.clearTimeout(timer);
      if (document.hidden) return;
      const now = new Date();
      setTime(bandungTime.format(now));
      timer = window.setTimeout(tick, 1000 - now.getMilliseconds());
    }
    tick();
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [visible]);
  return <span className="masthead__clock" aria-hidden={!visible}>
    <time dateTime={time} aria-label={`Bandung local time ${time}, WIB`}>{time}</time>
    <span aria-hidden="true">WIB</span>
  </span>;
}

export default function Navbar() {
  const active = useActiveSection();
  const { theme, toggleTheme } = useTheme();
  const comic = theme === 'comic';
  const dock = useRef<HTMLElement>(null);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    const home = document.getElementById('home');
    if (!home) return;
    const mobile = window.matchMedia(compactScreen);
    // Observe the flow anchor: the Hero itself stays pinned during the first transition.
    const observer = new IntersectionObserver(([entry]) => {
      setFloating(!mobile.matches && !entry.isIntersecting);
    }, { rootMargin: '16px 0px 0px' });
    const syncLayout = () => {
      observer.disconnect();
      setFloating(!mobile.matches && window.scrollY > 16);
      if (!mobile.matches) observer.observe(home);
    };
    syncLayout();
    mobile.addEventListener('change', syncLayout);
    return () => {
      observer.disconnect();
      mobile.removeEventListener('change', syncLayout);
    };
  }, []);
  useEffect(() => {
    const dismissTips = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dock.current?.querySelectorAll('li:hover, li:focus-within').forEach(item => item.setAttribute('data-dismissed', ''));
      }
    };
    window.addEventListener('keydown', dismissTips);
    return () => window.removeEventListener('keydown', dismissTips);
  }, []);
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="masthead" data-floating={floating}>
      <div className="masthead__brand"><Wordmark /></div>
      <nav className="dock" aria-label="Main navigation" ref={dock}>
        <ul className="dock__items">
          {site.navigation.map(({ href, label }) => {
            const icon = icons[href];
            if (!icon) return null;
            return <DockItem key={href} href={href} label={label} icon={icon} current={active === href}
              variant={href === '#home' ? 'home' : href === '#contact' ? 'contact' : undefined}/>;
          })}
          <DockItem label="GitHub" icon="github" href={site.github} variant="social" external/>
          <DockItem label="LinkedIn" icon="linkedin" href={site.linkedin} variant="social" external/>
          <DockItem label="Theme" icon={comic ? 'moon' : 'sun'} variant="theme" onClick={toggleTheme}
            actionLabel={comic ? 'Switch to Cinematic Mode' : 'Switch to Comic Mode'}/>
        </ul>
      </nav>
      <BandungClock visible={floating} />
    </header>
  </>;
}
