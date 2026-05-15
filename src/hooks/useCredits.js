import { useState, useEffect, useCallback } from "react";
import { creditsApi } from "../api/credits";
import { useAuth } from "../store/AuthContext";

export function useCredits() {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(() => {
    if (!token) return;
    setLoadingSummary(true);
    creditsApi.summary(token)
      .then(setSummary)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingSummary(false));
  }, [token]);

  const fetchHistory = useCallback((limit = 50, offset = 0) => {
    if (!token) return;
    setLoadingHistory(true);
    creditsApi.history(token, limit, offset)
      .then((data) => setHistory(Array.isArray(data) ? data : data.items ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingHistory(false));
  }, [token]);

  useEffect(() => {
    fetchSummary();
    fetchHistory();
  }, [fetchSummary, fetchHistory]);

  return { summary, history, loadingSummary, loadingHistory, error, refetch: fetchSummary };
}
