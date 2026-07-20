import axios from "axios";

export const TOKEN_KEY = "thottalk_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Intercepteur de requête : attache le JWT à TOUTE requête sortante
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : normalise les erreurs pour toute l'app
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||        // message métier du backend
      (error.request ? "Serveur injoignable, vérifiez votre connexion" : error.message);
    return Promise.reject(new Error(message));
  }
);

export default api;