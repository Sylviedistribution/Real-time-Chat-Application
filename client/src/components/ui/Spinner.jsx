export default function Spinner({ size = 20, className = "" }) {
  return (
    <span
      role="status"
      aria-label="Chargement"
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 9)) }}
      className={`inline-block rounded-full border-current border-t-transparent animate-spin ${className}`}
    />
  );
}