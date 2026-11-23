import { useRef } from 'react';
import SectionLabel from '../components/ui/SectionLabel';
import Icon from '../components/ui/Icon';
import { site } from '../data/site';
import useSectionEntrance from '../hooks/useSectionEntrance';

const socials = [
  { label: 'Instagram', icon: 'instagram', url: site.instagram },
  { label: 'LinkedIn', icon: 'linkedin', url: site.linkedin },
  { label: 'GitHub', icon: 'github', url: site.github },
] as const;

export default function Contact() {
  const section = useRef<HTMLElement>(null);
  useSectionEntrance(section);

  return (
    <section id="contact" aria-labelledby="contact-title" className="contact section-shell content-section" tabIndex={-1} ref={section}>
      <SectionLabel>Contact</SectionLabel>
      <div className="contact__main">
        <h2 id="contact-title" className="display-heading" data-entrance="headline">Let's build<br/><span>something<span className="accent-red">.</span></span></h2>
        <a className="contact__email" href={`mailto:${site.email}`} data-entrance>{site.email}<Icon name="arrow-up-right" size={33}/></a>
      </div>
      <div className="contact__bottom" data-entrance>
        <div className="contact__socials">
          {socials.map(social => social.url
            ? <a key={social.label} href={social.url}><Icon name={social.icon} size={19}/>{social.label}</a>
            : <span key={social.label}><Icon name={social.icon} size={19}/>{social.label} coming soon</span>)}
        </div>
      </div>
    </section>
  );
}
