import api from "./axios";

export async function fetchConversationsApi() {
  const { data } = await api.get("/conversations");
  return data.conversations;
}

export async function getOrCreateConversationApi(userId) {
  const { data } = await api.post(`/conversations/with/${userId}`);
  return data.conversation;
}