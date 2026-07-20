import { usersMock } from "../../mocks/chat.mock";
import Avatar from "../ui/Avatar";

export default function MembersPanel({ room, open }) {
  const members = room.members
    .map((id) => usersMock[id])
    .filter(Boolean)
    .sort((a, b) => (a.status === "online" ? -1 : 1) - (b.status === "online" ? -1 : 1));

  const onlineCount = members.filter((m) => m.status === "online").length;

  return (
    <aside
      className={`${open ? "flex" : "hidden"} lg:flex flex-col w-48 shrink-0
        absolute lg:static right-0 inset-y-0 z-10
        bg-white border-l border-scribe/15 p-3`}
    >
      <p className="text-[11px] tracking-wider text-scribe font-medium mb-2">
        MEMBRES — {members.length} · {onlineCount} en ligne
      </p>
      <ul className="flex flex-col gap-2 overflow-y-auto">
        {members.map((m) => (
          <li key={m._id} className="flex items-center gap-2 text-sm">
            <Avatar username={m.username} status={m.status} size="sm" />
            <span className={`truncate ${m.status === "offline" ? "text-scribe" : "text-ink"}`}>
              {m.username}
            </span>
            {room.owner === m._id && (
              <span className="text-gold text-xs" title="Propriétaire du salon">♦ Owner</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}