import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsersApi } from "../../api/users.api";
import { useChat } from "../../hooks/useChat";
import Avatar from "../ui/Avatar";

export default function NewConversationModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const { startConversation } = useChat();
  const navigate = useNavigate();

  // Recherche différée : on attend 300 ms de silence avant d'interroger l'API
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");
        setResults(await searchUsersApi(term));
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (userId) => {
    try {
      const conversation = await startConversation(userId);
      onClose();
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-20 bg-ink/40 flex items-start justify-center pt-24 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-lg text-lapis mb-3">Nouvelle conversation</h2>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un utilisateur…"
          className="w-full px-3.5 py-2.5 rounded-lg border border-scribe/25 bg-papyrus text-sm
            placeholder:text-scribe/60 focus:outline-none focus:ring-2 focus:ring-lapis/30 focus:border-lapis"
        />

        <div className="mt-3 min-h-[120px] max-h-64 overflow-y-auto">
          {query.trim().length < 2 && (
            <p className="text-xs text-scribe px-1 py-2">Saisissez au moins 2 caractères.</p>
          )}
          {searching && <p className="text-xs text-scribe px-1 py-2">Recherche…</p>}
          {error && <p role="alert" className="text-sm text-danger px-1 py-2">{error}</p>}
          {!searching && !error && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-xs text-scribe px-1 py-2">Aucun utilisateur trouvé.</p>
          )}

          <ul className="flex flex-col">
            {results.map((u) => (
              <li key={u._id}>
                <button
                  onClick={() => handleSelect(u._id)}
                  className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-lapis/5 transition text-left"
                >
                  <Avatar username={u.username} status={u.status} size="sm" />
                  <span className="text-sm text-ink truncate">{u.username}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}