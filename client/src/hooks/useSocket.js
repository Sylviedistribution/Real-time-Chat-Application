import { useEffect, useState } from "react";
import { getSocket, disconnectSocket } from "../sockets/socket";
import { useAuth } from "./useAuth";

export function useSocket() {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;                 // pas de session → pas de socket
    const socket = getSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      disconnectSocket();              // logout ou démontage → fermeture propre
    };
  }, [user]);

  return { connected };
}