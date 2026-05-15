import MeshCanvas from "./MeshCanvas.jsx";

export default function LeftPanel() {
  return (
    <div style={{
      width: "52%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "40px 48px",
      position: "relative",
      overflow: "hidden",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
    }}>
      <MeshCanvas />

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15,
          color: "#fff", boxShadow: "0 0 24px rgba(79,126,248,0.35)",
        }}>G</div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text)", letterSpacing: -0.3 }}>
          GPT Widget
        </span>
      </div>

      {/* Headline */}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: 16 }}>
        <div style={{
          fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--accent)",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ width: 24, height: 1, background: "var(--accent)", display: "inline-block" }} />
          AI-платформа нового поколения
        </div>

        <h1 style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: -1.5, color: "var(--text)", marginBottom: 20,
        }}>
          Ваши ассистенты.<br />
          <span style={{
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Ваши правила.
          </span>
        </h1>

        <p style={{ fontSize: 15, color: "var(--subtle)", lineHeight: 1.65, maxWidth: 380, fontWeight: 300 }}>
          Создавайте умных AI-агентов с собственной базой знаний. Подключайте к сайту за 2 минуты — без программистов.
        </p>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 32, marginTop: 40,
          paddingTop: 32, borderTop: "1px solid var(--border)",
        }}>
          {[
            { num: "12 400+", label: "Активных ботов" },
            { num: "98.7%",   label: "Аптайм" },
            { num: "0.8с",    label: "Среднее время ответа" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5 }}>
                {s.num}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonial pill */}
        <div style={{
          marginTop: 28, display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
          borderRadius: 50, padding: "10px 16px", width: "fit-content",
        }}>
          <div style={{ display: "flex" }}>
            {[
              { letter: "А", from: "#4f7ef8", to: "#7c5cf8" },
              { letter: "М", from: "#3ac97a", to: "#4f7ef8" },
              { letter: "Д", from: "#f0a83a", to: "#f04f5e" },
            ].map(a => (
              <div key={a.letter} style={{
                width: 26, height: 26, borderRadius: "50%",
                border: "2px solid var(--surface)",
                marginRight: -8, fontSize: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 600, color: "#fff",
                background: `linear-gradient(135deg,${a.from},${a.to})`,
                flexShrink: 0,
              }}>
                {a.letter}
              </div>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "var(--subtle)" }}>
            <strong style={{ color: "var(--text)" }}>3 800+</strong> команд уже используют GPT Widget
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1, fontSize: 11, color: "var(--muted)" }}>
        © 2026 GPT Widget · <a href="#" style={{ color: "inherit" }}>Условия</a> · <a href="#" style={{ color: "inherit" }}>Конфиденциальность</a>
      </div>
    </div>
  );
}
