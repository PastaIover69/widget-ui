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

export default function SuperadminOverviewPage() {
  const { secret, logout } = useSuperadmin();
  const navigate = useNavigate();
  const toast = useToast();

  const [metrics, setMetrics]   = useState(null);
  const [tenants, setTenants]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!secret) { navigate("/superadmin/login", { replace: true }); return; }
    setLoading(true);
    Promise.all([
      superadminApi.metrics(secret),
      superadminApi.tenants(secret),
    ])
      .then(([m, t]) => { setMetrics(m); setTenants(Array.isArray(t) ? t : []); })
      .catch((e) => {
        if (e.message.includes("401") || e.message.toLowerCase().includes("unauthorized")) {
          logout(); navigate("/superadmin/login", { replace: true });
        } else {
          setError(e.message);
        }
      })
      .finally(() => setLoading(false));
  }, [secret]);

  if (!secret) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <SuperadminHeader />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 28px" }}>

          {/* Title */}
          <div style={{ marginBottom: 32, animation: "fadeUp .35s ease both" }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-.4px", marginBottom: 4 }}>
              Обзор платформы
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>Общая статистика по всем тенантам</p>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(240,79,94,.08)", border: "1px solid rgba(240,79,94,.2)", borderRadius: 12, color: "var(--red)", fontSize: 13, marginBottom: 24 }}>
              {error}
            </div>
          )}

          {/* Metrics grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32, animation: "fadeUp .4s .05s ease both" }}>
            <MetricCard label="Всего тенантов" value={metrics?.total_tenants} loading={loading}
              icon={<TenantsIcon />} accent="var(--accent)" />
            <MetricCard label="Активных" value={metrics?.active_tenants} loading={loading}
              icon={<ActiveIcon />} accent="var(--green)" />
            <MetricCard label="Токенов LLM" value={metrics?.total_llm_tokens?.toLocaleString("ru")} loading={loading}
              icon={<TokenIcon />} accent="#7c5cf8" />
            <MetricCard label="Минут Whisper" value={parseFloat(metrics?.total_whisper_minutes ?? 0).toFixed(1)} loading={loading}
              icon={<VoiceIcon />} accent="var(--amber)" />
          </div>

          {/* Recent tenants */}
          <div style={{ animation: "fadeUp .4s .1s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>
                Последние тенанты
              </span>
              <button onClick={() => navigate("/superadmin/tenants")} style={{
                fontSize: 12, color: "var(--accent)", background: "none",
                border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              }}>
                Все тенанты →
              </button>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {/* Table head */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 120px 120px 100px", padding: "10px 20px", borderBottom: "1px solid var(--border)" }}>
                {["Компания", "Email", "План", "Токены", "Статус"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--muted)" }}>{h}</span>
                ))}
              </div>

              {loading ? (
                <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
                  <Spinner />
                </div>
              ) : tenants.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", fontSize: 13, color: "var(--muted)" }}>Нет тенантов</div>
              ) : (
                tenants.slice(0, 6).map((t, i) => (
                  <TenantRow key={t.id} tenant={t} last={i === Math.min(tenants.length, 6) - 1}
                    onClick={() => navigate(`/superadmin/tenants/${t.id}`)} />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Toast />
    </div>
  );
}

function MetricCard({ label, value, loading, icon, accent }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", padding: "18px 20px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", bottom: -12, right: -12, width: 72, height: 72, borderRadius: "50%", background: `radial-gradient(circle,${accent}18,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <div style={{ color: accent }}>{icon}</div>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: -1, color: "var(--text)", lineHeight: 1 }}>
        {loading ? <Spinner small /> : (value ?? "—")}
      </div>
    </div>
  );
}

function TenantRow({ tenant: t, last, onClick }) {
  const [hover, setHover] = useState(false);
  const pc = PLAN_COLORS[t.plan] || PLAN_COLORS.free;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 120px 120px 100px",
        padding: "13px 20px",
        borderBottom: last ? "none" : "1px solid var(--border)",
        background: hover ? "rgba(255,255,255,.015)" : "transparent",
        cursor: "pointer", transition: "background .1s",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
        {t.name || "—"}
      </span>
      <span style={{ fontSize: 12, color: "var(--subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 8 }}>
        {t.email}
      </span>
      <span>
        <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: pc.bg, color: pc.color, textTransform: "capitalize" }}>
          {t.plan || "free"}
        </span>
      </span>
      <span style={{ fontSize: 12, color: "var(--subtle)", fontFamily: "'DM Mono',monospace" }}>
        {(t.llm_tokens_used ?? 0).toLocaleString("ru")}
      </span>
      <span>
        <span style={{
          padding: "3px 9px", borderRadius: 6, fontSize: 10, fontWeight: 600,
          background: t.is_active ? "rgba(58,201,122,.1)" : "rgba(240,79,94,.1)",
          color: t.is_active ? "var(--green)" : "var(--red)",
        }}>
          {t.is_active ? "Активен" : "Заблокирован"}
        </span>
      </span>
    </div>
  );
}

function Spinner({ small }) {
  return <div style={{ width: small ? 16 : 24, height: small ? 16 : 24, border: "2px solid var(--border-2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} />;
}

const TenantsIcon = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const ActiveIcon  = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const TokenIcon   = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>;
const VoiceIcon   = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/></svg>;
