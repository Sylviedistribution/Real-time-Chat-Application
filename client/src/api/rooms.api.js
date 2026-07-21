import api from "./axios";

export async function fetchRooms() {
  const { data } = await api.get("/rooms");
  return data.rooms;
}

export async function createRoomApi(payload) {
  const { data } = await api.post("/rooms", payload);
  return data.room;
}

export async function joinRoomApi(roomId) {
  const { data } = await api.post(`/rooms/${roomId}/join`);
  return data.room;
}

export async function leaveRoomApi(roomId) {
  const { data } = await api.post(`/rooms/${roomId}/leave`);
  return data;   // { room } ou { deleted: true }
}

export async function deleteRoomApi(roomId) {
  const { data } = await api.delete(`/rooms/${roomId}`);
  return data;
}

export async function kickMemberApi(roomId, userId, ban = false) {
  const { data } = await api.post(`/rooms/${roomId}/kick/${userId}`, { ban });
  return data.room;
}