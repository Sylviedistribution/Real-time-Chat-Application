import { createContext, useState, useEffect } from "react";
import { fetchRoomsMock, fetchConversationsMock } from "../mocks/chat.mock";

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [r, c] = await Promise.all([fetchRoomsMock(), fetchConversationsMock()]);
      if (!cancelled) {
        setRooms(r);
        setConversations(c);
        setLoading(false);
      }
    }
    load();

    return () => { cancelled = true; }; // nettoyage : ignorer une réponse arrivée trop tard
  }, []);

  return (
    <ChatContext.Provider value={{ rooms, conversations, loading }}>
      {children}
    </ChatContext.Provider>
  );
}