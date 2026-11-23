import { useEffect, useRef } from 'react';
import useWheelScroll from '../hooks/useWheelScroll';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import IntroLoader from '../components/motion/IntroLoader';
import { OpeningDeadline } from '../components/motion/OpeningDeadline';
import StackSequence from '../components/motion/StackSequence';
import TechStack from '../sections/TechStack';
import Experience from '../sections/Experience';
import DeveloperActivity from '../sections/DeveloperActivity';
import Contact from '../sections/Contact';

export default function App(){
 useWheelScroll();
 const openingDeadline = useRef<number | null>(null);
 useEffect(() => {
  const id = window.location.hash.slice(1);
  if (!id) return;
  const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }));
  return () => cancelAnimationFrame(frame);
 }, []);

 return <OpeningDeadline.Provider value={openingDeadline}>
  <IntroLoader />
  <Navbar />
  <main id="main" tabIndex={-1}><StackSequence/><TechStack/><Experience/><DeveloperActivity/><Contact/></main>
  <Footer />
 </OpeningDeadline.Provider>;
}
