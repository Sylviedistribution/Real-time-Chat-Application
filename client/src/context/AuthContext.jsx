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

<<<<<<< HEAD
  const updateProfile = (changes) => {
    setUser((prev) => {
      const updated = { ...prev, ...changes };
      localStorage.setItem("thottalk_user", JSON.stringify(updated));
      return updated;
    });
  };

=======
>>>>>>> 1aa6f45b82911598d043dcf90324f24003171291
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}