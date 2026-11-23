import Wordmark from '../ui/Wordmark';
import Icon from '../ui/Icon';
import { site } from '../../data/site';

export default function Footer() {
  return <footer className="site-footer">
    <div className="site-footer__top">
      <a href="#home" aria-label="Back to home"><Wordmark /></a>
      <a className="footer-back" href="#home">BACK TO TOP <Icon name="arrow-up-right" size={17}/></a>
    </div>
    <div className="site-footer__bottom"><span>© {new Date().getFullYear()} {site.name}</span><a href={`mailto:${site.email}`}>Say hello <Icon name="arrow-up-right" size={14}/></a></div>
  </footer>;
}
