const fakeDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

<<<<<<< HEAD
export const usersMock = {
  u1: { _id: "u1", username: "Sylvestre", status: "online" },
  u2: { _id: "u2", username: "Moussa", status: "online" },
  u3: { _id: "u3", username: "Binta", status: "offline" },
  u4: { _id: "u4", username: "Awa", status: "online" },
};

=======
>>>>>>> 1aa6f45b82911598d043dcf90324f24003171291
// Formes conformes aux schémas Mongoose de la Phase 5
const rooms = [
  { _id: "r1", name: "général", description: "Discussions libres", owner: "u1",
    members: ["u1", "u2", "u3", "u4"], isPrivate: false, unread: 3 },
  { _id: "r2", name: "projet-react", description: "Le PFE ThotTalk", owner: "u1",
    members: ["u1", "u2", "u3"], isPrivate: false, unread: 0 },
  { _id: "r3", name: "design", description: "UX/UI et maquettes", owner: "u2",
    members: ["u1", "u2"], isPrivate: false, unread: 0 },
];

const conversations = [
  { _id: "c1", participants: [
      { _id: "u1", username: "Sylvestre", status: "online" },
      { _id: "u2", username: "Moussa", status: "online" },
    ], unread: 1 },
  { _id: "c2", participants: [
      { _id: "u1", username: "Sylvestre", status: "online" },
      { _id: "u3", username: "Binta", status: "offline" },
    ], unread: 0 },
];

export async function fetchRoomsMock() {
  await fakeDelay();
  return rooms;
}

export async function fetchConversationsMock() {
  await fakeDelay();
  return conversations;
}