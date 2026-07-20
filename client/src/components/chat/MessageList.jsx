import { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, typingUser }) {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
      {messages.map((m) => (
        <MessageBubble key={m._id} message={m} isMine={m.sender?._id === user._id} />
      ))}
      {typingUser && (
        <p className="text-xs text-scribe italic ml-1 animate-pulse">
          {typingUser.username} est en train d'écrire…
        </p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}