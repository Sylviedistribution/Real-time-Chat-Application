const fakeDelay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export async function loginMock({ email }) {
  await fakeDelay(); // simule la latence réseau → on codera les états de chargement
  if (email === "erreur@test.com") throw new Error("Identifiants invalides");
  return { _id: "u1", username: "Sylvestre", email, avatarUrl: "", status: "online" };
}

export async function registerMock({ username, email }) {
  await fakeDelay();
  return { _id: "u2", username, email, avatarUrl: "", status: "online" };
}