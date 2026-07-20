export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={props.id} className="text-sm font-medium text-ink">{label}</label>}
      <input
        className={`px-3.5 py-2.5 rounded-lg border bg-white text-sm text-ink
          placeholder:text-scribe/60 transition focus:outline-none focus:ring-2
          ${error ? "border-danger focus:ring-danger/30" : "border-scribe/25 focus:ring-lapis/30 focus:border-lapis"}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}