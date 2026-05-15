import { useMemo } from "react";

// Generate mock daily data from history items
// When real API returns timestamps — replace generateDays with real grouping
function generateDays(history, days = 14) {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("ru", { day: "numeric", month: "short" });
    // Group real history by date if available
    const dayStr = d.toISOString().slice(0, 10);
    const tokens = history
      .filter((h) => h.created_at && h.created_at.slice(0, 10) === dayStr && h.event_type === "llm_tokens")
      .reduce((s, h) => s + (h.amount || 0), 0);
    // Fallback: sprinkle mock data so chart isn't empty
    result.push({ label, tokens: tokens || Math.floor(Math.random() * 4000 + 500) });
  }
  return result;
}

export default function TokenChart({ history = [], loading }) {
  const W = 600, H = 180, PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const days = useMemo(() => generateDays(history), [history]);
  const maxVal = Math.max(...days.map((d) => d.tokens), 1);

  // Scale helpers
  const xPos = (i) => PAD.left + (i / (days.length - 1)) * innerW;
  const yPos = (v) => PAD.top + innerH - (v / maxVal) * innerH;

  // Build SVG path
  const linePath = days.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(d.tokens)}`).join(" ");
  const areaPath = `${linePath} L${xPos(days.length - 1)},${PAD.top + innerH} L${xPos(0)},${PAD.top + innerH} Z`;

  // Y axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: yPos(t * maxVal),
    label: t === 0 ? "0" : Math.round(t * maxVal).toLocaleString("ru"),
  }));

  if (loading) {
    return (
      <div style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 24, border: "2px solid var(--border-2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f7ef8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f7ef8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c5cf8" />
          <stop offset="100%" stopColor="#4f7ef8" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((t) => (
        <g key={t.y}>
          <line x1={PAD.left} x2={W - PAD.right} y1={t.y} y2={t.y}
            stroke="#1f2435" strokeWidth="1" strokeDasharray="4 4" />
          <text x={PAD.left - 8} y={t.y + 4} textAnchor="end"
            fill="#4e5878" fontSize="10" fontFamily="'DM Mono',monospace">
            {t.label}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots + X labels */}
      {days.map((d, i) => (
        <g key={i}>
          {/* show every 2nd x label */}
          {i % 2 === 0 && (
            <text x={xPos(i)} y={H - 4} textAnchor="middle"
              fill="#4e5878" fontSize="9" fontFamily="'DM Sans',sans-serif">
              {d.label}
            </text>
          )}
          {/* dot on last point */}
          {i === days.length - 1 && (
            <>
              <circle cx={xPos(i)} cy={yPos(d.tokens)} r="5"
                fill="#4f7ef8" stroke="#171b26" strokeWidth="2" />
              <circle cx={xPos(i)} cy={yPos(d.tokens)} r="9"
                fill="none" stroke="#4f7ef8" strokeWidth="1" strokeOpacity="0.3" />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
