import { Fragment } from 'react';
import type { CSSProperties } from 'react';
import { about } from '../data/about';
import Icon from '../components/ui/Icon';

const words = about.introduction.trim().split(/\s+/);

export default function About() {
  return (
    <div className="about section-shell">
      <h2 id="about-title" className="section-label">About me</h2>
      {about.isPlaceholder && <span className="placeholder-label">Sample bio</span>}
      <p className="about__lead" style={{ '--word-count': words.length } as CSSProperties}>
        {words.map((word, index) => (
          <Fragment key={index}>
            {index > 0 && ' '}
            <span className="about__word" style={{ '--word-index': index } as CSSProperties}>
              <span className="about__mist" aria-hidden="true">{word}</span>
              <span className="about__ink">{word}</span>
            </span>
          </Fragment>
        ))}
      </p>
      {about.example && (
        <div className="about__example">
          <p>{about.example.text}</p>
          {about.example.link && (
            <a className="text-link" href={about.example.link.href}>
              {about.example.link.label} <Icon name="arrow-up-right" size={18}/>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
