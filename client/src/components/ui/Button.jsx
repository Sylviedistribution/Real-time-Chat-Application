const styles = {
  primary: "bg-lapis hover:bg-lapis-light text-white",
  gold: "bg-gold hover:opacity-90 text-gold-soft",
  ghost: "bg-transparent hover:bg-lapis/5 text-lapis",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition
        active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold
        ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}