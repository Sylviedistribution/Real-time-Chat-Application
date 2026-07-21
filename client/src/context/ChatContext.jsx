import { createContext, useState, useEffect, useCallback } from "react";
import { fetchRooms, createRoomApi, joinRoomApi, leaveRoomApi, deleteRoomApi, kickMemberApi } from "../api/rooms.api";
import { fetchConversations } from "../api/conversations.api";

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [r, c] = await Promise.all([fetchRooms(), fetchConversations()]);
    setRooms(r);
    setConversations(c);
  }, []);

  useEffect(() => {
    let cancelled = false;
    refresh()
      .catch(() => {})               // erreur réseau : listes vides, pas de crash
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refresh]);

  // --- Actions : appel API puis mise à jour de l'état local ---
  const createRoom = async (payload) => {
    const room = await createRoomApi(payload);
    setRooms((prev) => [...prev, room]);
    return room;
  };

  const joinRoom = async (roomId) => {
    const room = await joinRoomApi(roomId);
    setRooms((prev) => prev.map((r) => (r._id === roomId ? room : r)));
    return room;
  };

  const leaveRoom = async (roomId) => {
    const result = await leaveRoomApi(roomId);
    if (result.deleted) setRooms((prev) => prev.filter((r) => r._id !== roomId));
    else setRooms((prev) => prev.map((r) => (r._id === roomId ? result.room : r)));
    return result;
  };

  const deleteRoom = async (roomId) => {
    await deleteRoomApi(roomId);
    setRooms((prev) => prev.filter((r) => r._id !== roomId));
  };

  const kickMember = async (roomId, userId, ban = false) => {
    const room = await kickMemberApi(roomId, userId, ban);
    setRooms((prev) => prev.map((r) => (r._id === roomId ? room : r)));
    return room;
  };

  return (
    <ChatContext.Provider value={{
      rooms, conversations, loading, refresh,
      createRoom, joinRoom, leaveRoom, deleteRoom, kickMember,
    }}>
      {children}
    </ChatContext.Provider>
  );
}