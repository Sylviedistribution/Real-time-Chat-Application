import { useState, useEffect } from "react";
import Spinner from "./Spinner";

export default function ConnectionStatus({ connected }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (connected) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [connected]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 -translate-x-1/2 z-30">
      <div
        role="status"
        className="flex items-center gap-2 bg-ink/90 text-white text-xs px-3.5 py-2 rounded-full shadow-lg backdrop-blur-sm"
      >
        <Spinner size={12} className="text-gold" />
        Reconnexion en cours…
      </div>
    </div>
  );
}