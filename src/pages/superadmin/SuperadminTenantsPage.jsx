import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperadmin } from "../../store/SuperadminContext";
import { superadminApi } from "../../api/superadmin";
import SuperadminHeader from "../../components/superadmin/SuperadminHeader";
import Toast, { useToast } from "../../components/Toast";

const PLAN_COLORS = {
  free:     { color: "var(--muted)",  bg: "var(--border)" },
  start:    { color: "var(--accent)", bg: "rgba(79,126,248,.12)" },
  pro:      { color: "#7c5cf8",       bg: "rgba(124,92,248,.12)" },
  business: { color: "var(--amber)",  bg: "rgba(240,168,58,.12)" },
};
const PLANS = ["free", "start", "pro", "business"];

export default function SuperadminTenantsPage() {
  const { secret, logout } = useSuperadmin();
  const navigate = useNavigate();
  const toast = useToast();

  const [tenants, setTenants]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [updating, setUpdating]     = useState(null); // tenant id being updated

  useEffect(() => {
    if (!secret) { navigate("/superadmin/login", { replace: true }); return; }
    load();
  }, [secret]);

  function load() {
    setLoading(true);
    superadminApi.tenants(secret)
      .then((data) => setTenants(Array.isArray(data) ? data : []))
      .catch((e) => {
        if (e.message.includes("401")) { logout(); navigate("/superadmin/login", { replace: true }); }
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }

  async function changePlan(id, plan) {
    setUpdating(id);
    try {
      await superadminApi.updateTenant(secret, id, { plan });
      setTenants(list => list.map(t => t.id === id ? { ...t, plan } : t));
      toast("План обновлён");
    } catch (e) {
      toast("Ошибка: " + e.message);
    } finally {
      setUpdating(null);
    }
  }

  async function toggleActive(id, current) {
    setUpdating(id);
    try {
      await superadminApi.updateTenant(secret, id, { is_active: !current });
      setTenants(list => list.map(t => t.id === id ? { ...t, is_active: !current } : t));
      toast(!current ? "Тенант активирован" : "Тенант заблокирован");
    } catch (e) {
      toast("Ошибка: " + e.message);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = tenants.filter(t => {
    const matchSearch = !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || t.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  if (!secret) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <SuperadminHeader />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 28px" }}>

          {/* Title */}
          <div style={{ marginBottom: 28, animation: "fadeUp .35s ease both" }}>
            <button onClick={() => navigate("/superadmin")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, marginBottom: 14, fontFamily: "'DM Sans',sans-serif", padding: 0, transition: "color .15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--subtle)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Обзор
            </button>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-.4px", marginBottom: 4 }}>
              Тенанты <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 16, color: "var(--muted)", fontWeight: 400 }}>{loading ? "" : `(${tenants.length})`}</span>
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>Управление клиентами платформы</p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, animation: "fadeUp .4s .05s ease both" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", display: "flex", pointerEvents: "none" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или email..."
                style={{ width: "100%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 12px 9px 34px", fontSize: 13, color: "var(--text)", fontFamily: "'DM Sans',sans-serif", outline: "none" }}
                onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px rgba(79,126,248,.1)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            {/* Plan filter */}
            <div style={{ display: "flex", gap: 4, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 3 }}>
              {["all", ...PLANS].map(p => (
                <button key={p} onClick={() => setFilterPlan(p)} style={{
                  padding: "5px 12px", borderRadius: 7, border: "none",
                  background: filterPlan === p ? "var(--border-2)" : "transparent",
                  color: filterPlan === p ? "var(--text)" : "var(--muted)",
                  fontSize: 11, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", transition: "all .15s",
                  textTransform: "capitalize",
                }}>
                  {p === "all" ? "Все" : p}
                </button>
              ))}
            </div>

            <button onClick={load} style={{ padding: "9px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--muted)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Обновить
            </button>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(240,79,94,.08)", border: "1px solid rgba(240,79,94,.2)", borderRadius: 12, color: "var(--red)", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Table */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", animation: "fadeUp .4s .1s ease both" }}>
            {/* Head */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 110px 130px 130px 110px", padding: "10px 20px", borderBottom: "1px solid var(--border)" }}>
              {["Компания", "Email", "План", "Токены LLM", "Whisper мин", "Статус"].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted)" }}>{h}</span>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: 60, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 28, height: 28, border: "2px solid var(--border-2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
                {search || filterPlan !== "all" ? "Ничего не найдено" : "Нет тенантов"}
              </div>
            ) : (
              filtered.map((t, i) => (
                <TenantRow
                  key={t.id} tenant={t}
                  last={i === filtered.length - 1}
                  updating={updating === t.id}
                  onPlanChange={(plan) => changePlan(t.id, plan)}
                  onToggleActive={() => toggleActive(t.id, t.is_active)}
                  onClick={() => navigate(`/superadmin/tenants/${t.id}`)}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <Toast />
    </div>
  );
}

function TenantRow({ tenant: t, last, updating, onPlanChange, onToggleActive, onClick }) {
  const [hover, setHover]     = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const pc = PLAN_COLORS[t.plan] || PLAN_COLORS.free;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "2fr 2fr 110px 130px 130px 110px",
        padding: "13px 20px",
        borderBottom: last ? "none" : "1px solid var(--border)",
        background: hover ? "rgba(255,255,255,.015)" : "transparent",
        transition: "background .1s", alignItems: "center",
      }}
    >
      <span onClick={onClick} style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
        {t.name || "—"}
      </span>
      <span style={{ fontSize: 12, color: "var(--subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8, fontFamily: "'DM Mono',monospace" }}>
        {t.email}
      </span>

      {/* Plan selector */}
      <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setPlanOpen(v => !v)} style={{
          padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600,
          background: pc.bg, color: pc.color, border: "none", cursor: "pointer",
          textTransform: "capitalize", fontFamily: "'DM Sans',sans-serif",
          opacity: updating ? .5 : 1,
        }}>
          {t.plan || "free"} ▾
        </button>
        {planOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, background: "#1a2035", border: "1px solid var(--border-2)", borderRadius: 10, padding: 4, zIndex: 200, minWidth: 100, boxShadow: "0 8px 32px rgba(0,0,0,.4)" }}>
            {PLANS.map(p => {
              const c = PLAN_COLORS[p];
              return (
                <div key={p} onClick={() => { onPlanChange(p); setPlanOpen(false); }}
                  style={{ padding: "7px 12px", borderRadius: 7, fontSize: 11, fontWeight: 500, color: c.color, cursor: "pointer", textTransform: "capitalize", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {p}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <span style={{ fontSize: 12, color: "var(--subtle)", fontFamily: "'DM Mono',monospace" }}>
        {(t.llm_tokens_used ?? 0).toLocaleString("ru")}
      </span>
      <span style={{ fontSize: 12, color: "var(--subtle)", fontFamily: "'DM Mono',monospace" }}>
        {parseFloat(t.whisper_minutes_used ?? 0).toFixed(3)}
      </span>

      {/* Active toggle */}
      <div onClick={e => e.stopPropagation()}>
        <button onClick={onToggleActive} disabled={updating} style={{
          padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600,
          border: "none", cursor: updating ? "not-allowed" : "pointer",
          background: t.is_active ? "rgba(58,201,122,.1)" : "rgba(240,79,94,.1)",
          color: t.is_active ? "var(--green)" : "var(--red)",
          opacity: updating ? .5 : 1, fontFamily: "'DM Sans',sans-serif",
          transition: "all .15s",
        }}>
          {updating ? "…" : t.is_active ? "Активен" : "Заблокирован"}
        </button>
      </div>
    </div>
  );
}
