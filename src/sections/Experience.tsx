import { useRef } from 'react';
import SectionLabel from '../components/ui/SectionLabel';
import { experiences } from '../data/experience';
import useSectionEntrance from '../hooks/useSectionEntrance';

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  useSectionEntrance(section);

  return (
    <section id="experience" aria-labelledby="experience-title" className="experience section-shell content-section" tabIndex={-1} ref={section}>
      <SectionLabel>Experience</SectionLabel>
      <div className="experience__layout">
        <div className="experience__title">
          <h2 id="experience-title" className="display-heading" data-entrance="headline">My<br/><span>journey<span className="accent-red">.</span></span></h2>
        </div>
        <div className="experience__timeline">
          {experiences.map(entry => (
            <article className="experience__row" key={entry.id} data-entrance>
              <div>
                <div className="experience__date">
                  <span>{entry.period}</span>
                  {entry.isPlaceholder && <span className="placeholder-label">Sample entry</span>}
                </div>
                <h3>{entry.role}</h3>
                <p className="experience__organization">{entry.organization}</p>
                <p>{entry.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
