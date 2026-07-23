import api from "./axios";

export async function updateMeApi(changes) {
  const { data } = await api.patch("/users/me", changes);
  return data.user;
}

export async function searchUsersApi(q) {
  const { data } = await api.get("/users/search", { params: { q } });
  return data.users;
}