// Même API que socket.io-client : on / off / emit.
// En Phase 7, ce fichier sera remplacé par la vraie connexion.

const listeners = new Map(); // événement -> Set de callbacks

function on(event, callback) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(callback);
}

function off(event, callback) {
  listeners.get(event)?.delete(callback);
}

function dispatch(event, payload) {
  listeners.get(event)?.forEach((cb) => cb(payload));
}

// --- Simulation : Awa et Moussa parlent dans les salons ---
const fakeAuthors = [
  { _id: "u2", username: "Moussa", status: "online" },
  { _id: "u4", username: "Awa", status: "online" },
];
const fakeLines = [
  "Vous avez vu la maquette ? 🎨",
  "Je viens de pousser sur le repo",
  "On se fait un point demain matin ?",
  "Le hook XOR est vraiment élégant",
  "Quelqu'un a testé sur mobile ?",
];

let timer = null;

function startSimulation(roomId) {
  stopSimulation();
  timer = setInterval(() => {
    const author = fakeAuthors[Math.floor(Math.random() * fakeAuthors.length)];
    // 1) l'indicateur de frappe...
    dispatch("user:typing", { roomId, user: author });
    // 2) ...puis le message, 1,5 s plus tard
    setTimeout(() => {
      dispatch("message:new", {
        _id: `m_${Date.now()}`,
        sender: author,
        room: roomId,
        content: fakeLines[Math.floor(Math.random() * fakeLines.length)],
        type: "text",
        status: "sent",
        createdAt: new Date().toISOString(),
      });
    }, 1500);
  }, 8000);
}

function stopSimulation() {
  if (timer) clearInterval(timer);
  timer = null;
}

// --- Émission côté client (envoi d'un message) ---
function emit(event, payload, ack) {
  if (event === "message:send") {
    // Simule la persistance serveur : latence puis accusé avec le message complet
    setTimeout(() => {
      ack?.({
        ...payload,
        _id: `m_${Date.now()}`,
        status: "sent",
        createdAt: new Date().toISOString(),
      });
    }, 400);
  }
}

export const socketMock = { on, off, emit, startSimulation, stopSimulation };