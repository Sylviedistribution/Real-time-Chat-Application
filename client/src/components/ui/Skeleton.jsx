export default function Skeleton({ className = "" }) {
  return <span className={`block rounded bg-current opacity-10 animate-pulse ${className}`} />;
}