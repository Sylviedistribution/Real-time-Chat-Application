export default function ChatWelcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
      <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold flex items-center justify-center font-display text-3xl">T</div>
      <h2 className="font-display text-xl text-lapis">Bienvenue sur ThotTalk</h2>
      <p className="text-sm text-scribe max-w-xs">
        Sélectionne un salon ou une conversation pour commencer à échanger.
      </p>
    </div>
  );
}