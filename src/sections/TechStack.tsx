import { technologies, technologyGroups, workflow } from '../data/tech';
import SectionLabel from '../components/ui/SectionLabel';
import TechLogo from '../components/ui/TechLogo';
import TechPathMarquee from '../components/motion/TechPathMarquee';
import '../styles/arsenal.css';

export default function TechStack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="arsenal section-shell" tabIndex={-1}>
      <header className="arsenal-header">
        <SectionLabel>Capabilities / 04</SectionLabel>
        <h2 id="stack-title" className="display-heading">My Arsenal<span>.</span></h2>
        <div className="arsenal-intro">
          <p>Languages, frameworks, and tools I've worked with.</p>
          <p className="arsenal-meta">{technologies.length} technologies / {technologyGroups.length} categories</p>
        </div>
      </header>
      <TechPathMarquee />
      <div className="arsenal-matrix">
        {technologyGroups.map((group, category) => (
          <section className="arsenal-group" key={group.id} aria-labelledby={`group-${group.id}`}>
            <header>
              <div className="arsenal-group__meta"><span>Group / {String(category + 1).padStart(2, '0')}</span>
                <span aria-label={`${group.technologies.length} technologies`}>{String(group.technologies.length).padStart(2, '0')}</span>
              </div>
              <h3 id={`group-${group.id}`}>{group.title}</h3>
            </header>
            <ul>{group.technologies.map((tech, index) => <li key={tech.logo}>
              <TechLogo tech={tech}/><span>{tech.name}</span>
              <small aria-hidden="true">{category + 1}.{index + 1}</small>
            </li>)}</ul>
          </section>
        ))}
      </div>
      <aside className="arsenal-workflow" aria-labelledby="workflow-title">
        <h3 id="workflow-title">Workflow / Support</h3>
        <dl>{workflow.map(tool => <div key={tool.name}><dt>{tool.name}</dt><dd>{tool.use}</dd></div>)}</dl>
      </aside>
    </section>
  );
}
