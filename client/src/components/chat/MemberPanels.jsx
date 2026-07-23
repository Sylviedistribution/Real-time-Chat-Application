import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import Avatar from "../ui/Avatar";

export default function MembersPanel({ room, open }) {
  const { user } = useAuth();
  const { kickMember } = useChat();

  const iAmOwner = (room.owner._id ?? room.owner) === user._id;
  const members = [...room.members].sort((a, b) =>
    (a.status === "online" ? -1 : 1) - (b.status === "online" ? -1 : 1)
  );

  const onlineCount = members.filter((m) => m.status === "online").length;

  const handleKick = async (target, ban) => {
    const verb = ban ? "bannir" : "expulser";
    if (!window.confirm(`Voulez-vous vraiment ${verb} ${target.username} ?`)) return;
    try {
      await kickMember(room._id, target._id, ban);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <aside className={`${open ? "flex" : "hidden"} lg:flex flex-col w-52 shrink-0
      absolute lg:static right-0 inset-y-0 z-10 bg-white border-l border-scribe/15 p-3`}>
      <p className="text-[11px] tracking-wider text-scribe font-medium mb-2">
        MEMBRES — {members.length} · {onlineCount} en ligne
      </p>
      <ul className="flex flex-col gap-2 overflow-y-auto">
        {members.map((m) => {
          const isOwnerRow = (room.owner._id ?? room.owner) === m._id;
          return (
            <li key={m._id} className="group flex items-center gap-2 text-sm">
              <Avatar username={m.username} status={m.status} size="sm" />
              <span className={`truncate flex-1 ${m.status === "offline" ? "text-scribe" : "text-ink"}`}>
                {m.username}
              </span>
              {isOwnerRow && <span className="text-gold text-xs" title="Propriétaire">♦</span>}
              {iAmOwner && !isOwnerRow && (
                <span className="hidden group-hover:flex gap-1">
                  <button onClick={() => handleKick(m, false)} title="Expulser"
                    className="text-xs text-scribe hover:text-danger transition">✕</button>
                  <button onClick={() => handleKick(m, true)} title="Bannir définitivement"
                    className="text-xs text-scribe hover:text-danger transition">⛔</button>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}