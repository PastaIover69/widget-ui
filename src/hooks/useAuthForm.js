import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuth } from "../store/AuthContext";

export function useLogin() {
  const { saveSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function login({ email, password, remember }) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login({ email, password });
      // data.access_token, data.token_type, data.expires_in
      const me = await authApi.me(data.access_token);
      saveSession(data.access_token, me, remember);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error, clearError: () => setError(null) };
}

export function useRegister() {
  const { saveSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function register({ name, email, password }) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register({ name, email, password });
      // After register — auto-login to get JWT
      const loginData = await authApi.login({ email, password });
      const me = await authApi.me(loginData.access_token);
      saveSession(loginData.access_token, me, true);
      // Store keys shown once
      return { success: true, api_key: data.api_key, widget_key: data.widget_key };
    } catch (e) {
      setError(e.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }

  return { register, loading, error, clearError: () => setError(null) };
}
