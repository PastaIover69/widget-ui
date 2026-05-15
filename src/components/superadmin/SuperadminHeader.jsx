import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperadmin } from "../../store/SuperadminContext";

export default function SuperadminHeader() {
  const { logout } = useSuperadmin();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg,#f04f5e,#f0a83a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11,
          color: "#fff", boxShadow: "0 0 16px rgba(240,79,94,0.3)",
        }}>SA</div>
        <div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
            GPT Widget
          </span>
          <span style={{ fontSize: 11, color: "var(--red)", marginLeft: 6, fontWeight: 500 }}>
            Superadmin
          </span>
        </div>
      </div>

      {/* Nav + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <NavBtn label="Обзор" path="/superadmin" navigate={navigate} />
        <NavBtn label="Тенанты" path="/superadmin/tenants" navigate={navigate} />

        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 8px" }} />

        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#f04f5e,#f0a83a)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 10, color: "#fff",
            }}
          >SA</button>

          {menuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "#1a2035", border: "1px solid var(--border-2)",
              borderRadius: 12, padding: 5, minWidth: 160,
              boxShadow: "0 16px 48px rgba(0,0,0,.5)", zIndex: 300,
              animation: "fadeDown .18s ease",
            }}>
              <div style={{ padding: "6px 12px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)" }}>
                Superadmin
              </div>
              <DropItem label="Выйти" danger onClick={() => { setMenuOpen(false); logout(); navigate("/superadmin/login"); }} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavBtn({ label, path, navigate }) {
  const active = window.location.pathname === path;
  return (
    <button onClick={() => navigate(path)} style={{
      padding: "6px 14px", borderRadius: 8, border: "none",
      background: active ? "var(--border-2)" : "transparent",
      color: active ? "var(--text)" : "var(--muted)",
      fontSize: 12, fontWeight: 500, cursor: "pointer",
      fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
    }}>
      {label}
    </button>
  );
}

function DropItem({ label, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
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
      {label}
    </div>
  );
}
