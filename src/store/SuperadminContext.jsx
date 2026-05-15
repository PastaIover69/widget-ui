import { createContext, useContext, useState, useCallback } from "react";
import { superadminApi } from "../api/superadmin";

const SuperadminContext = createContext(null);

export function SuperadminProvider({ children }) {
  const [secret, setSecret] = useState(
    () => sessionStorage.getItem("gptw_sa_secret") ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (inputSecret) => {
    setLoading(true);
    setError(null);
    try {
      await superadminApi.verify(inputSecret);
      sessionStorage.setItem("gptw_sa_secret", inputSecret);
      setSecret(inputSecret);
      return true;
    } catch (e) {
      setError("Неверный секрет или нет доступа");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("gptw_sa_secret");
    setSecret(null);
  }, []);

  return (
    <SuperadminContext.Provider value={{ secret, loading, error, login, logout }}>
      {children}
    </SuperadminContext.Provider>
  );
}

export const useSuperadmin = () => useContext(SuperadminContext);
