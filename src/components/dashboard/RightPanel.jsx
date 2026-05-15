import { useState } from "react";
import { useToast } from "../Toast";

const FAB_COLORS    = ["#4f7ef8","#7c5cf8","#36c26e","#E8735A","#111827"];
const HEADER_COLORS = ["#4f7ef8","#7c5cf8","#36c26e","#E8735A","#f0a83a"];

export default function RightPanel({ assistants, widgetConfig, onChange }) {
  const toast = useToast();

  function set(k, v) {
    onChange({ ...widgetConfig, [k]: v });
  }

  const { active=true, fabColor="#4f7ef8", headerColor="#4f7ef8", voiceEnabled=false, assistantId="" } = widgetConfig;

  const embedCode = `<script src="https://gptwidget.io/w.js" data-id="${assistantId || "your-id"}"><\/script>`;

  function copyEmbed() {
    navigator.clipboard.writeText(embedCode).catch(() => {});
    toast("Код скопирован");
  }

  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: "var(--bg)", borderLeft: "1px solid var(--border)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ padding:"16px 18px 12px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <span style={{ fontSize:10,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)" }}>
          Настройки виджета
        </span>
      </div>

      <div style={{ flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:22 }}>

        {/* Active toggle */}
        <ToggleRow
          label="Виджет активен"
          sub="Показывать кнопку на странице"
          value={active}
          onChange={v => { set("active", v); toast(v ? "Виджет включён" : "Виджет выключен"); }}
        />

        {/* FAB color */}
        <div>
          <RpLabel>Кнопка виджета</RpLabel>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{
              width:52,height:52,borderRadius:"50%",
              background:fabColor,color:"#fff",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,
              cursor:"pointer",flexShrink:0,
              boxShadow:`0 4px 18px ${fabColor}70`,
              transition:"background .3s",
            }}>GPT</div>
            <div>
              <div style={{ fontSize:11,color:"var(--muted)",marginBottom:8 }}>Цвет кнопки</div>
              <div style={{ display:"flex",gap:6 }}>
                {FAB_COLORS.map(c => (
                  <ColorDot key={c} color={c} active={fabColor===c}
                    onClick={() => { set("fabColor", c); toast("Цвет кнопки обновлён"); }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Header color */}
        <div>
          <RpLabel>Цвет шапки</RpLabel>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {HEADER_COLORS.map(c => (
              <ColorSwatch key={c} color={c} active={headerColor===c}
                onClick={() => { set("headerColor", c); toast("Цвет шапки обновлён"); }} />
            ))}
          </div>
        </div>

        {/* Voice toggle */}
        <ToggleRow
          label="Голосовой ответ"
          value={voiceEnabled}
          onChange={v => set("voiceEnabled", v)}
        />

        {/* Assistant picker */}
        <div>
          <RpLabel>Ассистент</RpLabel>
          <select
            value={assistantId}
            onChange={e => set("assistantId", e.target.value)}
            style={{
              width:"100%",background:"var(--surface)",border:"1px solid var(--border)",
              borderRadius:10,padding:"9px 12px",fontSize:12,color:"var(--text)",
              fontFamily:"'DM Sans',sans-serif",outline:"none",
              appearance:"none",cursor:"pointer",
              backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath fill='%234a5270' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
              backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",
            }}
          >
            <option value="">Выберите ассистента...</option>
            {assistants.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Embed code */}
        <div>
          <RpLabel>Интеграция</RpLabel>
          <div
            onClick={copyEmbed}
            style={{
              background:"#0a0d14",borderRadius:10,padding:"11px 13px",
              fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--green)",
              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
              cursor:"pointer",border:"1px solid var(--border)",
              transition:"color .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color="#5ee89e"}
            onMouseLeave={e => e.currentTarget.style.color="var(--green)"}
          >
            {embedCode}
          </div>
          <button onClick={copyEmbed} style={{
            width:"100%",padding:9,background:"var(--surface)",
            border:"1px solid var(--border)",borderRadius:9,
            fontSize:12,color:"var(--subtle)",cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif",marginTop:8,
            transition:"all .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background="var(--border)"; e.currentTarget.style.color="var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="var(--surface)"; e.currentTarget.style.color="var(--subtle)"; }}
          >
            Скопировать код
          </button>
        </div>

        {/* Speed mock */}
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:800,color:"var(--text)",letterSpacing:-1.5,lineHeight:1 }}>0.85s</div>
          <div style={{ fontSize:9,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"var(--muted)",marginTop:4 }}>Скорость отклика</div>
        </div>

      </div>
    </aside>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
      <div>
        <div style={{ fontSize:13,color:"var(--text)" }}>{label}</div>
        {sub && <div style={{ fontSize:10,color:"var(--muted)",marginTop:2 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width:40,height:22,borderRadius:11,
          background:value?"var(--accent)":"var(--border-2)",
          border:"none",cursor:"pointer",position:"relative",
          flexShrink:0,transition:"background .2s",
        }}
      >
        <div style={{
          width:16,height:16,borderRadius:"50%",background:"#fff",
          position:"absolute",top:3,transition:"left .18s",
          left:value?21:3,pointerEvents:"none",
        }} />
      </button>
    </div>
  );
}

function ColorDot({ color, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      width:22,height:22,borderRadius:"50%",background:color,cursor:"pointer",
      border:`2px solid ${active?"rgba(255,255,255,.5)":"transparent"}`,
      transition:"all .15s",
    }} />
  );
}

function ColorSwatch({ color, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      width:30,height:30,borderRadius:"50%",background:color,cursor:"pointer",
      border:`2.5px solid ${active?"rgba(255,255,255,.5)":"transparent"}`,
      boxShadow:active?"0 0 0 3px rgba(255,255,255,.08)":"none",
      position:"relative",transition:"all .15s",
    }}>
      {active && <div style={{ position:"absolute",inset:6,background:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") center/contain no-repeat" }} />}
    </div>
  );
}

function RpLabel({ children }) {
  return (
    <div style={{ fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:10 }}>
      {children}
    </div>
  );
}
