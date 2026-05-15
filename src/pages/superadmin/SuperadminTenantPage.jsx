import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSuperadmin } from "../../store/SuperadminContext";
import { superadminApi } from "../../api/superadmin";
import SuperadminHeader from "../../components/superadmin/SuperadminHeader";
import Toast, { useToast } from "../../components/Toast";

const PLANS = ["free", "start", "pro", "business"];
const PLAN_LIMITS = {
  free:     { tokens: 50000,     minutes: 10 },
  start:    { tokens: 2000000,   minutes: 60 },
  pro:      { tokens: 10000000,  minutes: 300 },
  business: { tokens: 50000000,  minutes: 1500 },
};
const PLAN_COLORS = {
  free:     { from: "#4e5878", to: "#2a3050" },
  start:    { from: "#4f7ef8", to: "#7c5cf8" },
  pro:      { from: "#7c5cf8", to: "#f04f5e" },
  business: { from: "#f0a83a", to: "#f04f5e" },
};

function ProgressBar({ used, limit }) {
  const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
  const color = pct > 85 ? "var(--red)" : pct > 60 ? "var(--amber)" : "var(--accent)";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "var(--subtle)" }}>{used?.toLocaleString("ru")} / {limit?.toLocaleString("ru")}</span>
        <span style={{ fontSize: 11, color, fontFamily: "'DM Mono',monospace" }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ height: 5, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 4, background: color, width: `${pct}%`, transition: "width .6s", boxShadow: `0 0 6px ${color}60` }} />
      </div>
    </div>
  );
}

export default function SuperadminTenantPage() {
  const { id } = useParams();
  const { secret, logout } = useSuperadmin();
  const navigate = useNavigate();
  const toast = useToast();

  const [tenant, setTenant]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!secret) { navigate("/superadmin/login", { replace: true }); return; }
    setLoading(true);
    superadminApi.tenant(secret, id)
      .then(setTenant)
      .catch(e => {
        if (e.message.includes("401")) { logout(); navigate("/superadmin/login", { replace: true }); }
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [id, secret]);

  async function update(body) {
    setSaving(true);
    try {
      const updated = await superadminApi.updateTenant(secret, id, body);
      setTenant(t => ({ ...t, ...updated, ...body }));
      toast("Сохранено");
    } catch (e) {
      toast("Ошибка: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!secret) return null;

  const plan  = tenant?.plan ?? "free";
  const pc    = PLAN_COLORS[plan] || PLAN_COLORS.free;
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <SuperadminHeader />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 28px" }}>

          {/* Back */}
          <button onClick={() => navigate("/superadmin/tenants")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, marginBottom: 20, fontFamily: "'DM Sans',sans-serif", padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--subtle)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Тенанты
          </button>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(240,79,94,.08)", border: "1px solid rgba(240,79,94,.2)", borderRadius: 12, color: "var(--red)", fontSize: 13, marginBottom: 24 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
              <div style={{ width: 32, height: 32, border: "2px solid var(--border-2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            </div>
          ) : tenant && (
            <div style={{ animation: "fadeUp .35s ease both" }}>

              {/* Header card */}
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle,${pc.from}15,transparent 70%)`, pointerEvents: "none" }} />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `linear-gradient(135deg,${pc.from},${pc.to})`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: "#fff",
                      }}>
                        {(tenant.name || tenant.email || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                          {tenant.name || "Без названия"}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      ID: <span style={{ fontFamily: "'DM Mono',monospace", color: "var(--subtle)" }}>{tenant.id}</span>
                    </div>
                    {tenant.created_at && (
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                        Зарегистрирован: {new Date(tenant.created_at).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <div style={{
                    padding: "6px 14px", borderRadius: 50,
                    background: tenant.is_active ? "rgba(58,201,122,.1)" : "rgba(240,79,94,.1)",
                    color: tenant.is_active ? "var(--green)" : "var(--red)",
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {tenant.is_active ? "Активен" : "Заблокирован"}
                  </div>
                </div>
              </div>

              {/* 2-col grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

                {/* Plan management */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>
                    Тарифный план
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {PLANS.map(p => {
                      const c = PLAN_COLORS[p];
                      const active = plan === p;
                      return (
                        <button key={p} onClick={() => !active && update({ plan: p })} disabled={saving || active}
                          style={{
                            padding: "11px 16px", borderRadius: 10, border: `1px solid ${active ? c.from + "60" : "var(--border)"}`,
                            background: active ? `linear-gradient(135deg,${c.from}15,${c.to}10)` : "var(--surface)",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            cursor: active || saving ? "default" : "pointer",
                            transition: "all .15s", fontFamily: "'DM Sans',sans-serif",
                          }}
                          onMouseEnter={e => { if (!active && !saving) e.currentTarget.style.borderColor = c.from + "40"; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "var(--border)"; }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: active ? c.from : "var(--subtle)", textTransform: "capitalize" }}>{p}</div>
                            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                              {PLAN_LIMITS[p].tokens.toLocaleString("ru")} токенов · {PLAN_LIMITS[p].minutes} мин
                            </div>
                          </div>
                          {active && (
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke={c.from} strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Usage stats */}
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>
                    Потребление
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      Токены LLM
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                      {(tenant.llm_tokens_used ?? 0).toLocaleString("ru")}
                    </div>
                    <ProgressBar used={tenant.llm_tokens_used ?? 0} limit={limits.tokens} />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/></svg>
                      Whisper минуты
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
                      {parseFloat(tenant.whisper_minutes_used ?? 0).toFixed(3)}
                    </div>
                    <ProgressBar used={parseFloat(tenant.whisper_minutes_used ?? 0)} limit={limits.minutes} />
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div style={{ background: "var(--card)", border: "1px solid rgba(240,79,94,.2)", borderRadius: "var(--radius)", padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--red)", marginBottom: 16 }}>
                  Управление доступом
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
                      {tenant.is_active ? "Заблокировать тенанта" : "Разблокировать тенанта"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {tenant.is_active
                        ? "Пользователь потеряет доступ к API и виджету"
                        : "Пользователь снова получит доступ к платформе"}
                    </div>
                  </div>
                  <button onClick={() => update({ is_active: !tenant.is_active })} disabled={saving}
                    style={{
                      padding: "10px 20px", borderRadius: 10, border: "none",
                      background: tenant.is_active ? "rgba(240,79,94,.12)" : "rgba(58,201,122,.12)",
                      color: tenant.is_active ? "var(--red)" : "var(--green)",
                      fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                      fontFamily: "'Syne',sans-serif", opacity: saving ? .6 : 1, transition: "all .15s",
                      flexShrink: 0,
                    }}
                  >
                    {saving ? "…" : tenant.is_active ? "Заблокировать" : "Разблокировать"}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Toast />
    </div>
  );
}
