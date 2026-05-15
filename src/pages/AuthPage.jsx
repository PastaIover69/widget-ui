import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import LeftPanel from "../components/LeftPanel.jsx";
import LoginPanel from "./LoginPanel.jsx";
import RegisterPanel from "./RegisterPanel.jsx";
import KeysModal from "../components/KeysModal.jsx";
import Toast from "../components/Toast.jsx";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]     = useState("login"); // "login" | "register"
  const [keys, setKeys]   = useState(null);    // { api_key, widget_key }

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  function handleRegisterSuccess(keyData) {
    setKeys(keyData);
  }

  function handleKeysClose() {
    setKeys(null);
    navigate("/dashboard", { replace: true });
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{
          width: 32, height: 32,
          border: "2px solid var(--border-2)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "spin .7s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Left branding panel */}
      <LeftPanel />

      {/* Right form panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 48px", position: "relative",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Tabs */}
          <div style={{
            display: "flex", gap: 4,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: 4, marginBottom: 32,
          }}>
            {[
              { id: "login",    label: "Войти" },
              { id: "register", label: "Регистрация" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: "10px 0", textAlign: "center",
                  fontSize: 13, fontWeight: 500, borderRadius: 10,
                  cursor: "pointer", border: "none", fontFamily: "'DM Sans',sans-serif",
                  background: tab === t.id ? "var(--border-2)" : "transparent",
                  color: tab === t.id ? "var(--text)" : "var(--muted)",
                  transition: "all .2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Forms */}
          {tab === "login" ? (
            <LoginPanel onSwitch={() => setTab("register")} />
          ) : (
            <RegisterPanel
              onSwitch={() => setTab("login")}
              onSuccess={handleRegisterSuccess}
            />
          )}
        </div>

        <div style={{ position: "absolute", bottom: 24, fontSize: 11, color: "var(--muted)" }}>
          Безопасное соединение · SSL/TLS
        </div>
      </div>

      {/* Keys modal after register */}
      {keys && (
        <KeysModal
          api_key={keys.api_key}
          widget_key={keys.widget_key}
          onClose={handleKeysClose}
        />
      )}

      <Toast />
    </div>
  );
}
