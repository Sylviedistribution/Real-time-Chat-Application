import { useState } from "react";

export default function MessageInput({ onSend, roomName }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const content = value.trim();
    if (!content) return;
    onSend(content);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2.5 px-4 py-3 bg-white border-t border-scribe/15">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Écrire dans ${roomName}…`}
        maxLength={2000}
        className="flex-1 px-4 py-2.5 rounded-full bg-papyrus border border-scribe/25 text-sm
          placeholder:text-scribe/60 focus:outline-none focus:ring-2 focus:ring-lapis/30 focus:border-lapis"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="Envoyer"
        className="w-10 h-10 rounded-full bg-gold text-gold-soft flex items-center justify-center
          transition active:scale-95 disabled:opacity-40"
      >
        ➤
      </button>
    </form>
  );
}