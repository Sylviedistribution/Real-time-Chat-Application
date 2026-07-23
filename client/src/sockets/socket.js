import { io } from "socket.io-client";
import { TOKEN_KEY } from "../api/axios";

let socket = null;

export function getSocket() {
  if (!socket) {
    // L'URL du socket = celle de l'API sans le suffixe /api
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
      .replace(/\/api$/, "");
    socket = io(baseUrl, {
      autoConnect: false,   // c'est useSocket qui décide QUAND se connecter
      auth: (cb) => cb({ token: localStorage.getItem(TOKEN_KEY) }),
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}