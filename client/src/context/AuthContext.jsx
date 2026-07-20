import { createContext, useState, useEffect } from "react";
import { registerApi, loginApi, meApi } from "../api/auth.api";
import { TOKEN_KEY } from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage : si un token existe, demander au SERVEUR qui nous sommes
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await meApi(); // le token part via l'intercepteur
        if (!cancelled) setUser(me);
      } catch {
        // Token invalide, expiré, ou compte supprimé : on nettoie
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    restoreSession();

    return () => { cancelled = true; };
  }, []);

  const login = async (credentials) => {
    const { user: logged, token } = await loginApi(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(logged);
  };

  const register = async (formData) => {
    const { user: created, token } = await registerApi(formData);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(created);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = (changes) => {
    setUser((prev) => ({ ...prev, ...changes }));
    // ⇄ Lot B3 : deviendra un PATCH /api/users/me persisté
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}