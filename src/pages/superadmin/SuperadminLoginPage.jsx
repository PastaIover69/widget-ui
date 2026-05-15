import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperadmin } from "../../store/SuperadminContext";
import MeshCanvas from "../../components/MeshCanvas";

export default function SuperadminLoginPage() {
  const { login, loading, error, secret } = useSuperadmin();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (secret) navigate("/superadmin", { replace: true });
  }, [secret, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    const ok = await login(value.trim());
    if (ok) navigate("/superadmin", { replace: true });
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--bg)", overflow: "hidden",
    }}>
      {/* Left panel */}
      <div style={{
        width: "52%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "40px 48px",
        background: "var(--surface)", borderRight: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <MeshCanvas />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#f04f5e,#f0a83a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#fff",
            boxShadow: "0 0 24px rgba(240,79,94,0.35)",
          }}>SA</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
            GPT Widget <span style={{ color: "var(--red)", fontSize: 13 }}>Superadmin</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{ position: "relative", zIndex: 1, paddingBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--red)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 24, height: 1, background: "var(--red)", display: "inline-block" }} />
            Только для администраторов
          </div>
          <h1 style={{
            fontFamily: "'Syne',sans-serif", fontSize: "clamp(28px,3.5vw,48px)",
            fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5,
            color: "var(--text)", marginBottom: 20,
          }}>
            Панель управления<br />
            <span style={{
              background: "linear-gradient(90deg,#f04f5e,#f0a83a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>платформой.</span>
          </h1>
          <p style={{ fontSize: 15, color: "var(--subtle)", lineHeight: 1.65, maxWidth: 360, fontWeight: 300 }}>
            Управление тенантами, тарифными планами и метриками всей платформы GPT Widget.
          </p>

          {/* Warning box */}
          <div style={{
            marginTop: 32, padding: "14px 16px",
            background: "rgba(240,79,94,0.07)", border: "1px solid rgba(240,79,94,0.2)",
            borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f04f5e" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span style={{ fontSize: 12, color: "var(--red)", lineHeight: 1.6 }}>
              Доступ только с секретом из переменной <code style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, background: "rgba(240,79,94,0.1)", padding: "1px 5px", borderRadius: 4 }}>SUPERADMIN_SECRET</code> на сервере.
            </span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, fontSize: 11, color: "var(--muted)" }}>
          © 2026 GPT Widget · Внутренний доступ
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 48px",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: -0.3 }}>
            Вход в суперадминку
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
            Введите SUPERADMIN_SECRET из файла .env
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Secret input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
                Секрет
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", display: "flex", pointerEvents: "none" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </span>
                <input
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="change-me-superadmin"
                  autoComplete="off"
                  style={{
                    width: "100%",
                    background: "var(--surface)",
                    border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
                    borderRadius: 12, padding: "13px 42px",
                    fontSize: 14, color: "var(--text)",
                    fontFamily: "'DM Mono',monospace",
                    outline: "none",
                    boxShadow: error ? "0 0 0 3px rgba(240,79,94,0.1)" : "none",
                    transition: "border-color .2s, box-shadow .2s",
                  }}
                  onFocus={e => { if (!error) { e.target.style.borderColor = "#f04f5e"; e.target.style.boxShadow = "0 0 0 3px rgba(240,79,94,0.12)"; }}}
                  onBlur={e => { if (!error) { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}}
                />
                <button type="button" onClick={() => setShow(v => !v)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--muted)", display: "flex", padding: 4,
                }}>
                  {show
                    ? <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
              {error && <div style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>{error}</div>}
            </div>

            <button type="submit" disabled={loading || !value.trim()} style={{
              width: "100%", padding: 14,
              background: "linear-gradient(135deg,#f04f5e,#f0a83a)",
              color: "#fff", fontSize: 14, fontWeight: 600,
              fontFamily: "'Syne',sans-serif", letterSpacing: ".02em",
              border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !value.trim() ? 0.6 : 1,
              transition: "opacity .2s",
              boxShadow: "0 4px 24px rgba(240,79,94,0.3)",
            }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />
                  Проверяем...
                </span>
              ) : "Войти в панель"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--muted)" }}>
            Это закрытая зона. Обычные пользователи не имеют доступа.
          </div>
        </div>
      </div>
    </div>
  );
}
