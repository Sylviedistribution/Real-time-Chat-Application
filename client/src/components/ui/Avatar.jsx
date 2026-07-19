const sizes = { sm: "w-6 h-6 text-[11px]", md: "w-9 h-9 text-sm" };

export default function Avatar({ username = "?", status, size = "md" }) {
  return (
    <span className={`relative inline-flex items-center justify-center rounded-full
      bg-lapis-light text-white font-medium shrink-0 ${sizes[size]}`}>
      {username.charAt(0).toUpperCase()}
      {status && (
        <span
          className={`absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full
            border-2 border-white ${status === "online" ? "bg-nil" : "bg-scribe/50"}`}
          title={status === "online" ? "En ligne" : "Hors ligne"}
        />
      )}
    </span>
  );
}