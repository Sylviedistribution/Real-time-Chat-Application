import api from "./axios";

export async function registerApi({ username, email, password }) {
    const { data } = await api.post("/auth/register", { username, email, password });
    return data; // { success, user, token }
}

export async function loginApi({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
}

export async function meApi() {
    const { data } = await api.get("/auth/me");
    return data; // { success, user }
}