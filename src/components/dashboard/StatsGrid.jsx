import { useNavigate } from "react-router-dom";
import { useCredits } from "../../hooks/useCredits";

const PLAN_LABELS = { free: "Free", start: "Start", pro: "Pro", business: "Business" };

export default function StatsGrid({ assistants, onTopup }) {
  const navigate = useNavigate();
  const { summary, loading } = useCredits();

  const totalDialogs = assistants.reduce((s, a) => s + (a.dialogs || 0), 0);
  const totalVoice   = assistants.reduce((s, a) => s + (a.voice   || 0), 0);

  const tokensUsed  = summary?.llm_tokens_used      ?? 0;
  const tokensLimit = summary?.llm_tokens_limit      ?? 50000;
  const minutesUsed = summary?.whisper_minutes_used  ?? 0;
  const plan        = summary?.plan ?? "free";
  const pct         = tokensLimit ? Math.round((tokensUsed / tokensLimit) * 100) : 0;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      gap: 12, marginBottom: 36,
      animation: "fadeUp .4s .05s ease both",
    }}>
      <StatCard label="Активных ассистентов" value={assistants.length}
        sub={assistants.length === 0 ? "Создайте первого" : `+${assistants.length} за месяц`}
        subColor="var(--green)" />

      <StatCard label="Диалогов за 30 дней" value={totalDialogs.toLocaleString("ru")}
        sub={totalDialogs ? "+22% к прошлому" : "Нет данных"}
        subColor="var(--green)" clickable />

      <StatCard label="Голосовых минут" value={loading ? "—" : minutesUsed.toFixed(1)}
        sub={minutesUsed ? `из ${summary?.whisper_minutes_limit ?? 10} мин` : "Нет данных"}
        subColor="var(--green)" clickable />

      {/* Credits card */}
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "16px 18px",
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
          Токены / {PLAN_LABELS[plan]}
        </div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "-.5px", color: "var(--text)", marginBottom: 6 }}>
          {loading ? "—" : tokensUsed.toLocaleString("ru")}
        </div>
        {/* progress bar */}
        <div style={{ height: 4, background: "var(--border)", borderRadius: 4, marginBottom: 6, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 4, transition: "width .5s",
            background: pct > 80 ? "var(--red)" : pct > 50 ? "var(--amber)" : "var(--accent)",
            width: `${Math.min(pct, 100)}%`,
          }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--amber)" }}>
            {loading ? "…" : `${pct}% использовано`}
          </span>
          <button onClick={() => navigate("/dashboard/credits")} style={{
            fontSize: 11, color: "var(--accent)", background: "none",
            border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
          }}>
            Подробнее →
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, subColor, clickable }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => clickable && setHover(true)}
      onMouseLeave={() => clickable && setHover(false)}
      style={{
        background: "var(--card)",
        border: `1px solid ${hover ? "var(--border-2)" : "var(--border)"}`,
        borderRadius: "var(--radius)", padding: "16px 18px",
        cursor: clickable ? "pointer" : "default",
        transition: "border-color .2s",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-.5px", color: "var(--text)", marginBottom: 5 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: subColor }}>{sub}</div>
    </div>
  );
}

// useState needed inside StatCard
import { useState } from "react";
