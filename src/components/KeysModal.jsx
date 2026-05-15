import { useState } from "react";

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} style={{
      background: copied ? "rgba(58,201,122,0.15)" : "var(--border)",
      border: "none", borderRadius: 6, padding: "4px 10px",
      fontSize: 11, color: copied ? "var(--green)" : "var(--subtle)",
      cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
      transition: "all .2s", flexShrink: 0,
    }}>
      {copied ? "Скопировано" : "Копировать"}
    </button>
  );
}

function KeyRow({ label, value, tag }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
          {label}
        </span>
        <span style={{
          fontSize: 10, padding: "2px 7px", borderRadius: 20,
          background: tag === "sk" ? "rgba(240,168,58,0.12)" : "rgba(79,126,248,0.12)",
          color: tag === "sk" ? "var(--amber)" : "var(--accent)",
          fontWeight: 500,
        }}>
          {tag === "sk" ? "Только сервер" : "Для виджета"}
        </span>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "10px 12px",
      }}>
        <code style={{ flex: 1, fontSize: 12, color: "var(--subtle)", wordBreak: "break-all", fontFamily: "monospace" }}>
          {value}
        </code>
        <CopyBtn text={value} />
      </div>
    </div>
  );
}

export default function KeysModal({ api_key, widget_key, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24,
      animation: "fadeUp .25s ease",
    }}>
      <div style={{
        background: "var(--bg)", border: "1px solid var(--border-2)",
        borderRadius: 20, padding: 32, maxWidth: 480, width: "100%",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(58,201,122,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "popIn .4s cubic-bezier(.175,.885,.32,1.275)",
          }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#3ac97a" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
              Аккаунт создан!
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Сохраните ключи — они показываются только один раз</div>
          </div>
        </div>

        {/* Warning */}
        <div style={{
          background: "rgba(240,168,58,0.08)", border: "1px solid rgba(240,168,58,0.2)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 20, marginTop: 16,
          fontSize: 12, color: "var(--amber)", lineHeight: 1.5,
        }}>
          ⚠️ После закрытия этого окна ключи больше не будут показаны. Скопируйте и сохраните их в надёжном месте.
        </div>

        <KeyRow label="Admin Key (sk-)" value={api_key} tag="sk" />
        <KeyRow label="Widget Key (pk-)" value={widget_key} tag="pk" />

        <button onClick={onClose} style={{
          width: "100%", marginTop: 8,
          padding: "13px",
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          color: "#fff", fontSize: 14, fontWeight: 600,
          fontFamily: "'Syne',sans-serif",
          border: "none", borderRadius: 12, cursor: "pointer",
          boxShadow: "0 4px 24px rgba(79,126,248,0.3)",
        }}>
          Я сохранил ключи — продолжить
        </button>
      </div>
    </div>
  );
}
