import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import Avatar from "../ui/Avatar";
import CreateRoomModal from "../rooms/CreateRoomModal";

function SectionTitle({ children, action }) {
  return (
    <div className="px-4 pt-4 pb-1 flex items-center justify-between">
      <p className="text-[11px] tracking-wider text-white/50 font-medium">{children}</p>
      {action}
    </div>
  );
}

const itemClass = ({ isActive }) =>
  `flex items-center gap-2 mx-2 px-2.5 py-1.5 rounded-md text-sm transition
   ${isActive ? "bg-lapis-light text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { rooms, conversations, loading, joinRoom } = useChat();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [joining, setJoining] = useState(null);

  const isMember = (room) => room.members.some((m) => (m._id ?? m) === user._id);
  const myRooms = rooms.filter(isMember);
  const otherRooms = rooms.filter((r) => !isMember(r));

  const handleJoin = async (roomId) => {
    try {
      setJoining(roomId);
      await joinRoom(roomId);
      navigate(`/chat/${roomId}`);
    } catch (err) {
      alert(err.message);            // provisoire : toast propre en finitions
    } finally {
      setJoining(null);
    }
  };

  return (
    <aside className="w-full md:w-60 shrink-0 bg-lapis flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="w-8 h-8 rounded-lg bg-gold text-gold-soft flex items-center justify-center font-display text-lg">T</div>
        <span className="font-display text-white">ThotTalk</span>
      </div>

      <nav className="flex-1 overflow-y-auto pb-2">
        <SectionTitle
          action={
            <button
              onClick={() => setShowCreate(true)}
              title="Créer un salon"
              className="text-white/50 hover:text-gold transition text-base leading-none"
            >
              ＋
            </button>
          }
        >
          Mes salons
        </SectionTitle>
        {loading && <p className="px-4 py-1.5 text-sm text-white/40">Chargement…</p>}
        {!loading && myRooms.length === 0 && (
          <p className="px-4 py-1.5 text-xs text-white/40">Créez ou rejoignez un salon ↓</p>
        )}
        {myRooms.map((room) => (
          <NavLink key={room._id} to={`/chat/${room._id}`} className={itemClass}>
            <span className="text-white/40">#</span>
            <span className="truncate">{room.name}</span>
          </NavLink>
        ))}

        {otherRooms.length > 0 && (
          <>
            <SectionTitle>À découvrir</SectionTitle>
            {otherRooms.map((room) => (
              <div key={room._id} className="flex items-center gap-2 mx-2 px-2.5 py-1.5 text-sm text-white/50">
                <span className="text-white/30">#</span>
                <span className="truncate flex-1">{room.name}</span>
                <button
                  onClick={() => handleJoin(room._id)}
                  disabled={joining === room._id}
                  className="text-xs bg-gold/90 hover:bg-gold text-gold-soft rounded px-2 py-0.5 transition disabled:opacity-50"
                >
                  {joining === room._id ? "…" : "Rejoindre"}
                </button>
              </div>
            ))}
          </>
        )}

        <SectionTitle>Messages privés</SectionTitle>
        {conversations.map((conv) => {
          const other = conv.participants.find((p) => p._id !== user._id);
          if (!other) return null;
          return (
            <NavLink key={conv._id} to={`/chat/${conv._id}`} className={itemClass}>
              <Avatar username={other.username} status={other.status} size="sm" />
              <span className="truncate">{other.username}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-lapis-light/40">
        <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition">
          <Avatar username={user.username} status="online" size="md" />
          <span className="text-sm text-white truncate">{user.username}</span>
        </NavLink>
        <button onClick={logout} title="Se déconnecter" className="ml-auto text-white/50 hover:text-white transition text-sm">⏻</button>
      </div>

      {showCreate && <CreateRoomModal onClose={() => setShowCreate(false)} />}
    </aside>
  );
}