import api from "./axios";

export async function fetchMessagesApi(channelId, page = 1) {
  const { data } = await api.get(`/messages/${channelId}`, { params: { page } });
  return data; // { messages, pagination }
}
export async function sendMessageApi(channelId, content) {
  const { data } = await api.post(`/messages/${channelId}`, { content });
  return data.message;
}