import { useNavigate } from "react-router-dom";
import { useCredits } from "../../hooks/useCredits";
import AppHeader from "../../components/dashboard/AppHeader";
import StatsRow from "../../components/credits/StatsRow";
import PlanCard from "../../components/credits/PlanCard";
import TokenChart from "../../components/credits/TokenChart";
import HistoryTable from "../../components/credits/HistoryTable";
import Toast from "../../components/Toast";

export default function CreditsPage() {
  const navigate = useNavigate();
  const { summary, history, loadingSummary, loadingHistory } = useCredits();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AppHeader onNewAssistant={() => navigate("/dashboard")} />

      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 28px" }}>

          {/* Page title */}
          <div style={{ marginBottom: 32, animation: "fadeUp .35s ease both" }}>
            {/* Back link */}
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "none", border: "none", cursor: "pointer",
                color: "var(--muted)", fontSize: 12, marginBottom: 16,
                fontFamily: "'DM Sans',sans-serif", padding: 0,
                transition: "color .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--subtle)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Дашборд
            </button>

            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "-.4px", marginBottom: 4 }}>
              Кредиты и статистика
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Потребление токенов и голосовых минут в рамках вашего плана
            </p>
          </div>

          {/* Top 3 stats */}
          <div style={{ animation: "fadeUp .4s .05s ease both" }}>
            <StatsRow summary={summary} history={history} loading={loadingSummary} />
          </div>

          {/* Chart + Plan side by side */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 300px",
            gap: 16, marginBottom: 24,
            animation: "fadeUp .4s .1s ease both",
          }}>
            {/* Chart card */}
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "20px 20px 12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: "'Syne',sans-serif" }}>
                    Потребление токенов
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    За последние 14 дней
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>LLM токены</span>
                </div>
              </div>
              <TokenChart history={history} loading={loadingHistory} />
            </div>

            {/* Plan card */}
            <PlanCard summary={summary} loading={loadingSummary} />
          </div>

          {/* History table */}
          <div style={{ animation: "fadeUp .4s .15s ease both" }}>
            <HistoryTable history={history} loading={loadingHistory} />
          </div>

        </div>
      </main>

      <Toast />
    </div>
  );
}
