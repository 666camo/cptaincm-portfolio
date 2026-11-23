import { useRef } from 'react';
import { activity } from '../data/activity';
import SectionLabel from '../components/ui/SectionLabel';
import Icon from '../components/ui/Icon';
import useSectionEntrance from '../hooks/useSectionEntrance';

export default function DeveloperActivity() {
  const section = useRef<HTMLElement>(null);
  useSectionEntrance(section);

  return (
    <section id="activity" aria-labelledby="activity-title" className="activity section-shell content-section" tabIndex={-1} ref={section}>
      <SectionLabel>Developer activity</SectionLabel>
      <div className="activity__header">
        <h2 id="activity-title" className="display-heading" data-entrance="headline">In the <em>flow.</em></h2>
      </div>
      <div className="activity__grid">
        {activity.map(item => (
          <article className="activity__card" key={item.id} data-entrance>
            <div className="activity__card-top">
              <div className="activity__card-icon"><Icon name={item.id === 'github' ? 'github' : 'clock'} size={26}/></div>
              <span className="status-pill">{item.state === 'not-connected' ? 'Not connected' : 'No data'}</span>
            </div>
            <div className="activity__card-bottom">
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
