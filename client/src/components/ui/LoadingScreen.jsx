export default function LoadingScreen({ message = "Chargement de votre session…" }) {
  return (
    <div className="fixed inset-0 z-50 bg-papyrus flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <span className="absolute inset-0 rounded-2xl bg-gold/25 animate-ping" />
        <div className="relative w-14 h-14 rounded-2xl bg-gold text-gold-soft flex items-center justify-center font-display text-3xl">
          T
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-display text-xl text-lapis">ThotTalk</h1>
        <p className="text-sm text-scribe mt-1">{message}</p>
      </div>

      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: `${delay}ms` }}
            className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce"
          />
        ))}
      </div>
    </div>
  );
}