function BigStat({ label, value, sub, icon, accent = "var(--accent)", loading }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "20px 22px",
      display: "flex", flexDirection: "column", gap: 4,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", bottom: -12, right: -12,
        width: 72, height: 72, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}18, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
        <div style={{ color: accent }}>{icon}</div>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>
          {label}
        </span>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: -1, color: "var(--text)", lineHeight: 1 }}>
        {loading ? "—" : value}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export default function StatsRow({ summary, history, loading }) {
  const tokensUsed  = summary?.llm_tokens_used ?? 0;
  const tokensLimit = summary?.llm_tokens_limit ?? 50000;
  const minUsed     = parseFloat(summary?.whisper_minutes_used ?? 0);
  const totalCalls  = history.length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
      <BigStat
        label="Токенов использовано"
        value={tokensUsed.toLocaleString("ru")}
        sub={`из ${tokensLimit.toLocaleString("ru")} в месяц`}
        accent="var(--accent)"
        loading={loading}
        icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        }
      />
      <BigStat
        label="Голосовых минут"
        value={minUsed.toFixed(2)}
        sub={`из ${summary?.whisper_minutes_limit ?? 10} мин в месяц`}
        accent="#7c5cf8"
        loading={loading}
        icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/>
          </svg>
        }
      />
      <BigStat
        label="Запросов всего"
        value={totalCalls.toLocaleString("ru")}
        sub="из истории"
        accent="var(--green)"
        loading={loading}
        icon={
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        }
      />
    </div>
  );
}
