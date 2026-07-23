import { useState, useEffect } from "react";
import { fetchMessagesApi } from "../api/messages.api";
import { getSocket } from "../sockets/socket";
import { useAuth } from "./useAuth";

export function useMessages(channelId) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [typingUser] = useState(null);      // Lot B5
  const [loading, setLoading] = useState(true);

  // Effet 1 — l'historique par REST (inchangé)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessages([]);
    fetchMessagesApi(channelId)
      .then(({ messages: history }) => { if (!cancelled) setMessages(history); })
      .catch(() => { if (!cancelled) setMessages([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [channelId]);

  // Effet 2 — le temps réel par socket (de retour, en réel)
  useEffect(() => {
    const socket = getSocket();

    const joinChannel = () => {
      socket.emit("channel:join", channelId, (res) => {
        if (!res?.success) console.warn("join refusé :", res?.message);
      });
    };

    joinChannel();                 // à l'entrée dans le salon
    socket.on("connect", joinChannel);   // et après chaque reconnexion

    function handleNew(message) {
      const chanId = message.room || message.conversation;
      if (chanId !== channelId) return;                    // pas pour cet écran
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
    }

    socket.on("message:new", handleNew);

    return () => {
      socket.emit("channel:leave", channelId);
      socket.off("connect", joinChannel);
      socket.off("message:new", handleNew);
    };
  }, [channelId]);

  // Envoi optimiste — l'ack socket remplace l'await REST
  const sendMessage = (content) => {
    const socket = getSocket();
    const tempId = `tmp_${Date.now()}`;
    const optimistic = {
      _id: tempId, sender: user, content, type: "text",
      status: "sending", createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    socket.emit("message:send", { channelId, content }, (ack) => {
      if (ack?.success) {
        setMessages((prev) => {
          const dejaRecu = prev.some((m) => m._id === ack.message._id);
          return dejaRecu
            ? prev.filter((m) => m._id !== tempId)
            : prev.map((m) => (m._id === tempId ? ack.message : m));
        });
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
        alert(ack?.message || "Échec de l'envoi");
      }
    });
  };

  return { messages, typingUser, loading, sendMessage };
}