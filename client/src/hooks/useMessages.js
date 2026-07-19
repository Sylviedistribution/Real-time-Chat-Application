import { useState, useEffect } from "react";
import { socketMock } from "../mocks/socket.mock";
import { fetchMessagesMock } from "../mocks/messages.mock";
import { useAuth } from "./useAuth";

export function useMessages(roomId) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effet 1 — charger l'historique à chaque changement de salon (futur GET REST)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessages([]);

    fetchMessagesMock(roomId).then((history) => {
      if (!cancelled) {
        setMessages(history);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [roomId]);

  // Effet 2 — s'abonner aux événements temps réel du salon
  useEffect(() => {
    function handleNew(message) {
      if (message.room !== roomId) return; // pas pour ce salon → ignorer
      setMessages((prev) => [...prev, message]);
      setTypingUser(null);
    }
    function handleTyping({ roomId: r, user: u }) {
      if (r !== roomId || u._id === user._id) return;
      setTypingUser(u);
      setTimeout(() => setTypingUser(null), 3000);
    }

    socketMock.on("message:new", handleNew);
    socketMock.on("user:typing", handleTyping);
    socketMock.startSimulation(roomId);

    return () => {
      socketMock.off("message:new", handleNew);
      socketMock.off("user:typing", handleTyping);
      socketMock.stopSimulation();
    };
  }, [roomId, user._id]);

  // Envoi optimiste
  const sendMessage = (content) => {
    const tempId = `tmp_${Date.now()}`;
    const optimistic = {
      _id: tempId,
      sender: user,
      room: roomId,
      content,
      type: "text",
      status: "sending",               // ← l'horloge WhatsApp
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    socketMock.emit("message:send", { room: roomId, content }, (confirmed) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? { ...confirmed, sender: user } : m))
      );
    });
  };

  return { messages, typingUser, loading, sendMessage };
}