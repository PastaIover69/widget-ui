import { useState } from "react";

const EyeOpen = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
);
const EyeClosed = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
  </svg>
);

export default function Field({ label, type = "text", placeholder, value, onChange, error, icon, autoComplete }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: "block",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 7,
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 14, top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)", display: "flex", pointerEvents: "none",
          }}>
            {icon}
          </span>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
            borderRadius: 12,
            padding: `13px 14px 13px ${icon ? 42 : 14}px`,
            paddingRight: isPassword ? 42 : 14,
            fontSize: 14,
            color: "var(--text)",
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color .2s, box-shadow .2s",
            boxShadow: error ? "0 0 0 3px rgba(240,79,94,0.1)" : "none",
            WebkitAppearance: "none",
          }}
          onFocus={e => {
            if (!error) {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.boxShadow = "0 0 0 3px rgba(79,126,248,0.12)";
            }
          }}
          onBlur={e => {
            if (!error) {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "none";
            }
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            style={{
              position: "absolute", right: 12, top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer", color: "var(--muted)",
              background: "none", border: "none", padding: 4,
              display: "flex", transition: "color .15s",
            }}
          >
            {showPw ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}
      </div>
      {error && (
        <div style={{ fontSize: 11, color: "var(--red)", marginTop: 5 }}>
          {error}
        </div>
      )}
    </div>
  );
}
