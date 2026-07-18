import { createContext, useState, useEffect } from "react";
import { loginMock, registerMock } from "../mocks/auth.mock";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au montage : restaurer la session depuis le stockage local
  useEffect(() => {
    const saved = localStorage.getItem("thottalk_user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const loggedUser = await loginMock(credentials); // ⇄ deviendra un appel API réel
    setUser(loggedUser);
    localStorage.setItem("thottalk_user", JSON.stringify(loggedUser));
  };

  const register = async (data) => {
    const newUser = await registerMock(data);
    setUser(newUser);
    localStorage.setItem("thottalk_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("thottalk_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}