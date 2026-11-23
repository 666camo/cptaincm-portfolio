import { useRef } from 'react';
import { projects } from '../data/projects';
import type { Project } from '../types/content';
import Icon from '../components/ui/Icon';
import ProjectArtwork from '../components/ui/ProjectArtwork';
import SectionLabel from '../components/ui/SectionLabel';
import useSectionEntrance from '../hooks/useSectionEntrance';

function ProjectCard({ project, number }: { project: Project; number: number }) {
  const study = project.featured ? project.caseStudy : undefined;

  return (
    <article className={`project-card ${project.featured ? 'project-card--featured' : ''}`} id={project.slug} tabIndex={-1} data-entrance>
      <div className="project-card__art">
        <span className="project-card__number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
        {project.cover.kind === 'illustration'
          ? <div aria-hidden="true"><ProjectArtwork theme={project.cover.theme}/></div>
          : <img src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} loading="lazy" decoding="async"/>}
      </div>
      <div className="project-card__body">
        <div className="project-card__metadata">
          <p>{project.category}{!study && <> <span className="project-card__separator">/</span> {project.role}</>}</p>
          {project.isPlaceholder && <span className="placeholder-label project-card__status">Sample project</span>}
        </div>
        <h3>{project.title}</h3>
        <div className="project-card__details">
          {study ? (
            <dl className="project-card__case">
              <div><dt>The challenge</dt><dd>{study.problem}</dd></div>
              <div><dt>My role</dt><dd>{project.role}</dd></div>
              <div><dt>What I built</dt><dd>{study.solution}</dd></div>
            </dl>
          ) : (
            <>
              <p>{project.summary}</p>
              <ul>
                {project.features.map(feature => <li key={feature}>{feature}</li>)}
              </ul>
            </>
          )}
          <p className="project-card__stack">{project.stack.join(' · ')}</p>
          <div className="project-card__links">
            {project.links.demo && <a href={project.links.demo}>Demo <Icon name="arrow-up-right" size={15}/></a>}
            {project.links.source && <a href={project.links.source}>Source <Icon name="arrow-up-right" size={15}/></a>}
            {!project.links.demo && !project.links.source && <span>Demo and source unavailable</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const section = useRef<HTMLDivElement>(null);
  useSectionEntrance(section);

  return (
    <div className="projects section-shell" ref={section}>
      <SectionLabel>Projects</SectionLabel>
      <div className="projects__head">
        <h2 id="projects-title" className="display-heading" data-entrance="headline">Selected{' '}<span className="projects__italic">works<span className="accent-red">.</span></span></h2>
        {projects.every(project => project.isPlaceholder) && <div className="projects__intro"><p>Concept projects illustrating the kinds of products I want to build.</p></div>}
      </div>
      <div className="projects__grid">
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} number={index + 1}/>)}
      </div>
    </div>
  );
}
