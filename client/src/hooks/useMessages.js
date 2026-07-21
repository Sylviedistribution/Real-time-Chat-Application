import { useState, useEffect } from "react";
import { fetchMessages, sendMessageApi } from "../api/messages.api";
import { useAuth } from "./useAuth";

export function useMessages(channelId) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [typingUser] = useState(null);   // réactivé au Lot B4 (socket réel)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMessages([]);

    fetchMessages(channelId)
      .then(({ messages: history }) => { if (!cancelled) setMessages(history); })
      .catch(() => { if (!cancelled) setMessages([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [channelId]);

  const sendMessage = async (content) => {
    const tempId = `tmp_${Date.now()}`;
    const optimistic = {
      _id: tempId, sender: user, content, type: "text",
      status: "sending", createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      const confirmed = await sendMessageApi(channelId, content);
      setMessages((prev) => prev.map((m) => (m._id === tempId ? confirmed : m)));
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      alert(err.message);
    }
  };

  return { messages, typingUser, loading, sendMessage };
}