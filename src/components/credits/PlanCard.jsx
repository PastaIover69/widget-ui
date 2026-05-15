const PLAN_NAMES = { free: "Free", start: "Start", pro: "Pro", business: "Business" };
const PLAN_COLORS = {
  free:     { from: "#4e5878", to: "#2a3050" },
  start:    { from: "#4f7ef8", to: "#7c5cf8" },
  pro:      { from: "#7c5cf8", to: "#f04f5e" },
  business: { from: "#f0a83a", to: "#f04f5e" },
};

function ProgressBar({ used, limit, color = "var(--accent)" }) {
  const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
  const barColor = pct > 85 ? "var(--red)" : pct > 60 ? "var(--amber)" : color;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "var(--subtle)" }}>
          {used?.toLocaleString("ru")} / {limit?.toLocaleString("ru")}
        </span>
        <span style={{ fontSize: 11, color: barColor, fontFamily: "'DM Mono',monospace" }}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div style={{ height: 6, background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 6,
          background: barColor,
          width: `${pct}%`,
          transition: "width .8s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 0 8px ${barColor}60`,
        }} />
      </div>
    </div>
  );
}

export default function PlanCard({ summary, loading }) {
  const plan = summary?.plan ?? "free";
  const colors = PLAN_COLORS[plan] || PLAN_COLORS.free;

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: 24, position: "relative", overflow: "hidden",
    }}>
      {/* Gradient accent top-right */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 140, height: 140, borderRadius: "50%",
        background: `radial-gradient(circle, ${colors.from}22, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
            Текущий план
          </div>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800,
            letterSpacing: -1, color: "var(--text)",
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {loading ? "—" : PLAN_NAMES[plan]}
          </div>
        </div>
        <div style={{
          padding: "5px 12px", borderRadius: 50,
          background: `linear-gradient(135deg,${colors.from}22,${colors.to}22)`,
          border: `1px solid ${colors.from}44`,
          fontSize: 11, fontWeight: 600,
          color: colors.from,
        }}>
          Активен
        </div>
      </div>

      {/* LLM tokens */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
          Токены LLM
        </div>
        <ProgressBar
          used={summary?.llm_tokens_used ?? 0}
          limit={summary?.llm_tokens_limit ?? 50000}
          color={colors.from}
        />
      </div>

      {/* Whisper minutes */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/>
          </svg>
          Голос (Whisper)
        </div>
        <ProgressBar
          used={parseFloat(summary?.whisper_minutes_used ?? 0)}
          limit={summary?.whisper_minutes_limit ?? 10}
          color="#7c5cf8"
        />
      </div>

      {/* Reset note */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)" }}>
        Лимиты обновляются каждый месяц
      </div>
    </div>
  );
}
