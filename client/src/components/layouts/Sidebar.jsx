import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import Avatar from "../ui/Avatar";

function SectionTitle({ children }) {
  return (
    <p className="px-4 pt-4 pb-1 text-[11px] tracking-wider text-white/50 font-medium">
      {children}
    </p>
  );
}

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span className="ml-auto bg-gold text-gold-soft text-[11px] font-medium rounded-full px-1.5 min-w-5 text-center">
      {count}
    </span>
  );
}

const itemClass = ({ isActive }) =>
  `flex items-center gap-2 mx-2 px-2.5 py-1.5 rounded-md text-sm transition
   ${isActive ? "bg-lapis-light text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { rooms, conversations, loading } = useChat();

  return (
    <aside className="w-full md:w-60 shrink-0 bg-lapis flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="w-8 h-8 rounded-lg bg-gold text-gold-soft flex items-center justify-center font-display text-lg">T</div>
        <span className="font-display text-white">ThotTalk</span>
      </div>

      <nav className="flex-1 overflow-y-auto pb-2">
        <SectionTitle>Salons</SectionTitle>
        {loading && <p className="px-4 py-1.5 text-sm text-white/40">Chargement…</p>}
        {rooms.map((room) => (
          <NavLink key={room._id} to={`/chat/${room._id}`} className={itemClass}>
            <span className="text-white/40">#</span>
            <span className="truncate">{room.name}</span>
            <UnreadBadge count={room.unread} />
          </NavLink>
        ))}

        <SectionTitle>Messages privés</SectionTitle>
        {conversations.map((conv) => {
          const other = conv.participants.find((p) => p._id !== user._id);
          return (
            <NavLink key={conv._id} to={`/chat/${conv._id}`} className={itemClass}>
              <Avatar username={other.username} status={other.status} size="sm" />
              <span className="truncate">{other.username}</span>
              <UnreadBadge count={conv.unread} />
            </NavLink>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-lapis-light/40">
        <Avatar username={user.username} status="online" size="md" />
        <span className="text-sm text-white truncate">{user.username}</span>
        <button
          onClick={logout}
          title="Se déconnecter"
          className="ml-auto text-white/50 hover:text-white transition text-sm"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}