import Avatar from "../ui/Avatar";

const time = (iso) =>
  new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const statusIcon = { sending: "🕐", sent: "✓", delivered: "✓✓", read: "✓✓" };

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
      {!isMine && <Avatar username={message.sender?.username ?? "?"} size="sm" />}
      <div className={`max-w-[75%] md:max-w-[60%] ${isMine ? "text-right" : ""}`}>
        <p className={`text-[11px] text-scribe mb-0.5 ${isMine ? "mr-1" : "ml-1"}`}>
          {!isMine && <span className="font-medium">{message.sender?.username ?? "Utilisateur supprimé"} · </span>}
          {time(message.createdAt)}
        </p>
        <div
          className={`inline-block px-3 py-2 text-sm text-left break-words
            ${isMine
              ? "bg-lapis text-white rounded-xl rounded-br-sm"
              : "bg-white text-ink border border-scribe/15 rounded-xl rounded-bl-sm"}`}
        >
          {message.content}
        </div>
        {isMine && (
          <p className={`text-[11px] mt-0.5 mr-1 ${message.status === "read" ? "text-nil" : "text-scribe"}`}>
            {statusIcon[message.status]} {message.status === "sending" ? "Envoi…" : ""}
          </p>
        )}
      </div>
    </div>
  );
}