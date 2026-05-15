import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("gptw_token"));
  const [loading, setLoading] = useState(!!localStorage.getItem("gptw_token"));

  // On mount — verify saved token
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authApi.me(token)
      .then(setUser)
      .catch(() => { localStorage.removeItem("gptw_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = useCallback((accessToken, userData, remember = true) => {
    setToken(accessToken);
    setUser(userData);
    if (remember) localStorage.setItem("gptw_token", accessToken);
    else sessionStorage.setItem("gptw_token", accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gptw_token");
    sessionStorage.removeItem("gptw_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
