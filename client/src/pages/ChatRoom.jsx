import { useParams, Link } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { useMessages } from "../hooks/useMessages";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import MembersPanel from "../components/chat/MembersPanel";

export default function ChatRoom() {
  const { roomId } = useParams();
  const { rooms, conversations, loading: chatLoading } = useChat();
  const { messages, typingUser, loading, sendMessage } = useMessages(roomId);
  const [showMembers, setShowMembers] = useState(false);

  if (chatLoading) return <div className="flex-1 flex items-center justify-center text-sm text-scribe">Chargement…</div>;

  const room = rooms.find((r) => r._id === roomId);
  const conv = conversations.find((c) => c._id === roomId);
  if (!room && !conv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-sm text-scribe">
        <p>Ce salon n'existe pas ou a été supprimé.</p>
        <Link to="/chat" className="text-gold hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const title = room ? `# ${room.name}` : conv.participants[1].username;

  return (
    <>
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-scribe/15">
        <Link to="/chat" className="md:hidden text-lapis text-lg" aria-label="Retour">←</Link>
        <h1 className="font-medium text-ink text-[15px] truncate">{title}</h1>
        {room && <span className="text-xs text-scribe">{room.members.length} membres</span>}
        {room && (
          <button
            onClick={() => setShowMembers((v) => !v)}
            aria-label="Afficher les membres"
            className="ml-auto lg:hidden text-scribe hover:text-lapis transition text-sm"
          >
            👥
          </button>
        )}
      </header>

      {loading
        ? <div className="flex-1 flex items-center justify-center text-sm text-scribe">Chargement des messages…</div>
        : <MessageList messages={messages} typingUser={typingUser} />}

      <MessageInput onSend={sendMessage} roomName={title} />
    </>
  );
}