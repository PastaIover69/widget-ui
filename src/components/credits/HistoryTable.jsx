import { useState } from "react";

const EVENT_META = {
  llm_tokens:      { label: "LLM запрос",    color: "var(--accent)",  bg: "rgba(79,126,248,.1)"  },
  whisper_minutes: { label: "Голос",          color: "#7c5cf8",        bg: "rgba(124,92,248,.1)"  },
  default:         { label: "Событие",        color: "var(--muted)",   bg: "var(--border)"        },
};

function EventBadge({ type }) {
  const m = EVENT_META[type] || EVENT_META.default;
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600,
      background: m.bg, color: m.color,
    }}>
      {m.label}
    </span>
  );
}

function formatDate(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleString("ru", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch { return str; }
}

function formatAmount(type, amount) {
  if (!amount && amount !== 0) return "—";
  if (type === "whisper_minutes") return `${parseFloat(amount).toFixed(3)} мин`;
  return `${Number(amount).toLocaleString("ru")} токенов`;
}

// Generate mock rows when history is empty (remove when real API returns data)
function mockRows(n = 20) {
  const types = ["llm_tokens", "whisper_minutes"];
  return Array.from({ length: n }, (_, i) => ({
    id: "mock_" + i,
    event_type: types[i % 2],
    amount: types[i % 2] === "llm_tokens" ? Math.floor(Math.random() * 3000 + 100) : (Math.random() * 0.5).toFixed(4),
    created_at: new Date(Date.now() - i * 3600000 * (1 + Math.random() * 5)).toISOString(),
    session_id: "sess_" + Math.random().toString(36).slice(2, 10),
  }));
}

const PAGE_SIZE = 10;

export default function HistoryTable({ history = [], loading }) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("all"); // "all" | "llm_tokens" | "whisper_minutes"

  const rows = history.length > 0 ? history : mockRows();
  const filtered = filter === "all" ? rows : rows.filter((r) => r.event_type === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const filters = [
    { id: "all",             label: "Все" },
    { id: "llm_tokens",      label: "LLM" },
    { id: "whisper_minutes", label: "Голос" },
  ];

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
          История запросов
        </span>
        <div style={{ display: "flex", gap: 4, background: "var(--surface)", borderRadius: 8, padding: 3 }}>
          {filters.map((f) => (
            <button key={f.id} onClick={() => { setFilter(f.id); setPage(0); }} style={{
              padding: "4px 12px", borderRadius: 6, border: "none",
              background: filter === f.id ? "var(--border-2)" : "transparent",
              color: filter === f.id ? "var(--text)" : "var(--muted)",
              fontSize: 11, fontWeight: 500, cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 24, height: 24, border: "2px solid var(--border-2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px 140px", padding: "10px 20px", borderBottom: "1px solid var(--border)" }}>
            {["Сессия", "Тип", "Объём", "Время"].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted)" }}>{h}</span>
            ))}
          </div>

          {pageRows.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
              Нет данных
            </div>
          ) : (
            pageRows.map((row, i) => (
              <div key={row.id ?? i} style={{
                display: "grid", gridTemplateColumns: "1fr 120px 160px 140px",
                padding: "12px 20px",
                borderBottom: i < pageRows.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background .1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.015)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 12, color: "var(--subtle)", fontFamily: "'DM Mono',monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
                  {row.session_id || "—"}
                </span>
                <span><EventBadge type={row.event_type} /></span>
                <span style={{ fontSize: 12, color: "var(--text)", fontFamily: "'DM Mono',monospace" }}>
                  {formatAmount(row.event_type, row.amount)}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {formatDate(row.created_at)}
                </span>
              </div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} из {filtered.length}
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                <PageBtn onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </PageBtn>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PageBtn key={i} active={i === page} onClick={() => setPage(i)}>{i + 1}</PageBtn>
                ))}
                <PageBtn onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </PageBtn>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 28, height: 28, borderRadius: 7, border: "none",
      background: active ? "var(--accent)" : "var(--border)",
      color: active ? "#fff" : disabled ? "var(--muted)" : "var(--subtle)",
      fontSize: 11, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", opacity: disabled ? .4 : 1,
    }}>
      {children}
    </button>
  );
}
