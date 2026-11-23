import { useRef } from 'react';
import AmbientBackground from '../components/hero/AmbientBackground';
import PortraitReveal from '../components/hero/PortraitReveal';
import Icon from '../components/ui/Icon';
import Wordmark from '../components/ui/Wordmark';
import { site } from '../data/site';
import useSectionEntrance from '../hooks/useSectionEntrance';

export default function Hero() {
  const hero = useRef<HTMLDivElement>(null);
  useSectionEntrance(hero);

  return (
    <div className="hero" ref={hero}>
      <AmbientBackground />
      <Wordmark className="hero__wordmark" />
      <span className="hero__issue" aria-hidden="true">Issue #001</span>
      <div className="hero__copy">
        <div className="hero__lead" data-entrance>
          <p className="hero__name">
            <span className="hero__name-text">{site.name}</span>
            <span className="hero__name-letters" aria-hidden="true">
              {Array.from(site.name, (letter, index) => (
                <span className="hero__letter" data-letter={letter} key={index}>
                  <span>{letter}</span>
                </span>
              ))}
            </span>
          </p>
          <p className="hero__role">{site.role.join(' ')}</p>
        </div>
        <h1 id="hero-title" className="hero__headline" data-entrance="headline">
          <span>Crafting digital</span>{' '}
          <span className="hero__headline--end">experiences.</span>
        </h1>
        <div className="hero__aside" data-entrance>
          <div className="hero__details">
            <p className="hero__specialty">{site.secondaryRole}</p>
            <p className="hero__location">{site.location}</p>
          </div>
          <div className="hero__actions">
            <a href="#projects" className="button button--primary">Explore Projects <Icon name="arrow-up-right" size={17}/></a>
            <a href="#contact" className="button button--outline">Let's Connect <Icon name="arrow-up-right" size={17}/></a>
            {site.resume
              ? <a href={site.resume} className="hero__resume" download>Download Resume</a>
              : <span className="hero__resume">Resume coming soon</span>}
          </div>
        </div>
      </div>
      <PortraitReveal />
      <p className="hero__scroll" aria-hidden="true"><Icon name="mouse" size={17}/> Scroll to explore</p>
    </div>
  );
}
