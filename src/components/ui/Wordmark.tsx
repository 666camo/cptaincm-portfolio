interface Props { className?: string; }
export default function Wordmark({ className = '' }: Props) {
  return <span className={`wordmark ${className}`} aria-label="cptaincm."><span>cptain</span><span className="wordmark__red">cm.</span></span>;
}
