import { Outlet, useMatch } from "react-router-dom";
import { ChatProvider } from "../context/ChatContext";
import Sidebar from "../components/layouts/Sidebar";
import {useSocket} from "../hooks/useSocket";
import ConnectionStatus from "../components/ui/ConnectionStatus";


export default function Chat() {
  const inRoom = Boolean(useMatch("/chat/:roomId"));
  const { connected } = useSocket();

  return (
    <ChatProvider>
      <div className="h-screen flex overflow-hidden">
       <ConnectionStatus connected={connected} />
        {/* Mobile : sidebar visible seulement hors salon. Desktop : toujours visible. */}
        <div className={`${inRoom ? "hidden" : "flex"} md:flex w-full md:w-auto`}>
          <Sidebar />
        </div>
        <main className={`${inRoom ? "flex" : "hidden"} md:flex flex-1 flex-col min-w-0`}>
          <Outlet />
        </main>
      </div>
    </ChatProvider>
  );
}