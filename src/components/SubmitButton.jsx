export default function SubmitButton({ loading, children, style = {} }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "'Syne', sans-serif",
        letterSpacing: "0.02em",
        border: "none",
        borderRadius: 12,
        cursor: loading ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden",
        opacity: loading ? 0.7 : 1,
        transition: "opacity .2s, transform .1s",
        boxShadow: "0 4px 24px rgba(79,126,248,0.3)",
        ...style,
      }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.92"; }}
      onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
      onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.99)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 18, height: 18,
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin .7s linear infinite",
          }} />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {children}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      )}
    </button>
  );
}
