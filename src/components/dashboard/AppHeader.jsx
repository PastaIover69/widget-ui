import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../store/AuthContext";

export default function AppHeader({ onNewAssistant }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const name = user?.name || user?.email || "Пользователь";
  const letter = (name[0] || "U").toUpperCase();
  const email = user?.email || "";

  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header style={{
      height: 54, background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32,
          background: "linear-gradient(135deg,var(--accent),var(--accent-2))",
          borderRadius: 9, display: "flex", alignItems: "center",
          justifyContent: "center", fontFamily: "'Syne',sans-serif",
          fontWeight: 800, fontSize: 13, color: "#fff",
          boxShadow: "0 0 16px rgba(79,126,248,.25)",
        }}>G</div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
          GPT Widget
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onNewAssistant}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 20px",
            background: "var(--accent)", color: "#fff",
            fontSize: 13, fontWeight: 600,
            border: "none", borderRadius: 50,
            cursor: "pointer", fontFamily: "'Syne',sans-serif",
            boxShadow: "0 4px 16px rgba(79,126,248,.25)",
            transition: "opacity .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = ".9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Новый ассистент
        </button>

        {/* Avatar + dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg,var(--accent),var(--accent-2))",
              border: `2px solid ${menuOpen ? "var(--accent)" : "var(--border-2)"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 700,
              color: "#fff", fontFamily: "'Syne',sans-serif",
              transition: "border-color .15s",
            }}
          >
            {letter}
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "#1a2035", border: "1px solid var(--border-2)",
              borderRadius: 12, padding: 5, minWidth: 180,
              boxShadow: "0 16px 48px rgba(0,0,0,.5)",
              zIndex: 300, animation: "fadeDown .18s ease",
            }}>
              <div style={{ padding: "6px 12px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)" }}>
                {email}
              </div>
              <DropItem icon={<ProfileIcon />} label="Профиль" onClick={() => { setMenuOpen(false); }} />
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
              <DropItem icon={<LogoutIcon />} label="Выйти" danger onClick={() => { setMenuOpen(false); logout(); }} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "8px 12px", borderRadius: 8, fontSize: 12,
        color: danger ? "var(--red)" : hover ? "var(--text)" : "var(--subtle)",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        background: hover ? (danger ? "rgba(240,79,94,.08)" : "var(--border)") : "transparent",
        transition: "all .1s",
      }}
    >
      {icon}{label}
    </div>
  );
}

const ProfileIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);
