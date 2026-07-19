import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";

export default function Chat() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-lapis text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold text-gold-soft flex items-center justify-center font-display text-lg">T</div>
          <span className="font-display text-lg">ThotTalk</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80">
            Connecté en tant que <strong className="text-white">{user.username}</strong>
          </span>
          <Button variant="gold" onClick={logout}>Se déconnecter</Button>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center">
        <p className="text-scribe text-sm">
          🏗 Zone de chat — construite au Lot 2 (sidebar, salons, messages)
        </p>
      </section>
    </main>
  );
}