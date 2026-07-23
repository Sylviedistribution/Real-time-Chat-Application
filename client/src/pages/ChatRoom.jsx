import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { useMessages } from "../hooks/useMessages";
import { useAuth } from "../hooks/useAuth";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import MembersPanel from "../components/chat/MemberPanels";
import MessagesSkeleton from "../components/chat/MessagesSkeleteton";
import Spinner from "../components/ui/Spinner";

export default function ChatRoom() {
  // --- 1. TOUS les hooks, avant toute condition ---
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms, conversations, loading: chatLoading, deleteRoom, leaveRoom } = useChat();
  const { messages, typingUser, loading, sendMessage } = useMessages(roomId);
  const [showMembers, setShowMembers] = useState(false);

  // --- 2. Données dérivées et handlers ---
  const room = rooms.find((r) => r._id === roomId);
  const conv = conversations.find((c) => c._id === roomId);
  const isOwner = room && (room.owner._id ?? room.owner) === user._id;

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer définitivement ${room.name} et tous ses messages ?`)) return;
    try {
      await deleteRoom(room._id);
      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm(`Quitter le salon ${room.name} ?`)) return;
    try {
      await leaveRoom(room._id);
      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 3. Rendus conditionnels, APRÈS les hooks ---
  if (chatLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner size={26} className="text-lapis/40" />
      </div>
    );
  }

  if (!room && !conv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-sm text-scribe">
        <p>Ce salon n'existe pas ou a été supprimé.</p>
        <Link to="/chat" className="text-gold hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const title = room
    ? `# ${room.name}`
    : conv.participants.find((p) => p._id !== user._id)?.username ?? "Conversation";

  // --- 4. Rendu principal ---
  return (
    <>
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-scribe/15">
        <Link to="/chat" className="md:hidden text-lapis text-lg" aria-label="Retour">←</Link>
        <h1 className="font-medium text-ink text-[15px] truncate">{title}</h1>
        {room && <span className="text-xs text-scribe">{room.members.length} membres</span>}
        {room && (
          <span className="ml-auto flex items-center gap-3">
            {isOwner
              ? <button onClick={handleDelete} className="text-xs text-scribe hover:text-danger transition">Supprimer</button>
              : <button onClick={handleLeave} className="text-xs text-scribe hover:text-danger transition">Quitter</button>}
            <button onClick={() => setShowMembers((v) => !v)} aria-label="Afficher les membres"
              className="lg:hidden text-scribe hover:text-lapis transition text-sm">👥</button>
          </span>
        )}
      </header>

      <div className="flex-1 flex min-h-0 relative">
        <div className="flex-1 flex flex-col min-w-0">
          {loading
            ? <MessagesSkeleton />
            : <MessageList messages={messages} typingUser={typingUser} />}
          <MessageInput onSend={sendMessage} roomName={title} />
        </div>
        {room && <MembersPanel room={room} open={showMembers} />}
      </div>
    </>
  );
}