const fakeDelay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

const history = {
  r1: [
    { _id: "h1", sender: { _id: "u4", username: "Awa" }, room: "r1",
      content: "Bienvenue dans #général 👋", type: "text", status: "read",
      createdAt: new Date(Date.now() - 3600e3).toISOString() },
  ],
  r2: [
    { _id: "h2", sender: { _id: "u4", username: "Awa" }, room: "r2",
      content: "Salut ! J'ai poussé la maquette sur le repo 🎨", type: "text", status: "read",
      createdAt: new Date(Date.now() - 1800e3).toISOString() },
    { _id: "h3", sender: { _id: "u1", username: "Sylvestre" }, room: "r2",
      content: "Excellent travail, je regarde ça tout de suite", type: "text", status: "read",
      createdAt: new Date(Date.now() - 1700e3).toISOString() },
  ],
};

export async function fetchMessagesMock(roomId) {
  await fakeDelay();
  return history[roomId] ?? [];
}