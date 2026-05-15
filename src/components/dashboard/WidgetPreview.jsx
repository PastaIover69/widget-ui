import { useState } from "react";

const CANNED = {
  тариф:    "Тариф «Бизнес» — 14 900 ₽/мес: 50 000 сообщений, 1 500 мин голоса, 20 ГБ базы.",
  цена:     "Планы: Старт — 2 900 ₽/мес, Бизнес — 14 900 ₽/мес, Enterprise — по запросу.",
  доставка: "По Москве бесплатно от 3 000 ₽. Регионы — от 290 ₽ через СДЭК. Срок: 1–5 дней.",
  гарантия: "Гарантия 12 месяцев. Возврат в течение 14 дней.",
  привет:   "Здравствуйте! Рад помочь. Спрашивайте про тарифы, доставку или условия.",
};
function getReply(text) {
  const t = text.toLowerCase();
  for (const k in CANNED) if (t.includes(k)) return CANNED[k];
  return "Уточните детали — дам более точный ответ из базы знаний.";
}

export default function WidgetPreview({ config, rightPanelWidth = 280 }) {
  const [open, setOpen]       = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [msgs, setMsgs]       = useState([]);
  const [typing, setTyping]   = useState(false);
  const [inputMode, setInputMode] = useState("voice"); // "voice" | "text"
  const [text, setText]       = useState("");
  const [recording, setRecording] = useState(false);

  const right = rightPanelWidth + 20;
  const { active=true, fabColor="#4f7ef8", headerColor="#4f7ef8" } = config;

  function openWidget() {
    if (!active) return;
    setOpen(true);
    setShowBadge(false);
    setInputMode("voice");
  }

  function send(msg) {
    const txt = (msg || text).trim();
    if (!txt) return;
    setText("");
    setMsgs(m => [...m, { role:"user", text:txt }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role:"ai", text:getReply(txt) }]);
    }, 700 + Math.random() * 500);
  }

  if (!active) return null;

  return (
    <>
      {/* FAB */}
      {!open && (
        <button onClick={openWidget} style={{
          position:"fixed", bottom:28, right:right,
          width:60, height:60, borderRadius:"50%",
          background:fabColor, color:"#fff", border:"none",
          cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", fontFamily:"'Syne',sans-serif",
          fontWeight:800, fontSize:12,
          boxShadow:`0 6px 24px ${fabColor}80`,
          transition:"transform .2s",
          zIndex:1000,
        }}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.07)"}
        onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
        >
          GPT
          {showBadge && (
            <div style={{
              position:"absolute",top:-2,right:-2,width:18,height:18,
              borderRadius:"50%",background:"var(--red)",color:"#fff",
              fontSize:9,fontWeight:700,fontFamily:"'Syne',sans-serif",
              display:"flex",alignItems:"center",justifyContent:"center",
              border:"2px solid var(--bg)",
            }}>1</div>
          )}
        </button>
      )}

      {/* Window */}
      {open && (
        <div style={{
          position:"fixed", bottom:100, right:right,
          width:340, height:470,
          background:"#fff", borderRadius:18, overflow:"hidden",
          display:"flex", flexDirection:"column",
          boxShadow:"0 12px 50px rgba(0,0,0,.22),0 0 0 1px rgba(0,0,0,.07)",
          zIndex:999,
          animation:"popIn .28s cubic-bezier(.175,.885,.32,1.275)",
        }}>
          {/* Header */}
          <div style={{ padding:"12px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0,background:headerColor,transition:"background .3s" }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",fontFamily:"'Syne',sans-serif",flexShrink:0 }}>G</div>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:"#fff" }}>GPT Widget ассистент</div>
              <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:10,color:"rgba(255,255,255,.75)",marginTop:1 }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:"#4ade80" }}/>Онлайн
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft:"auto",background:"rgba(255,255,255,.15)",border:"none",width:26,height:26,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.85)" }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1,overflowY:"auto",padding:12,background:"#f7f8fb",display:"flex",flexDirection:"column",gap:10 }}>
            <div style={{ background:"#fff",borderRadius:12,borderTopLeftRadius:3,padding:"9px 11px",fontSize:12,color:"#374151",lineHeight:1.55,maxWidth:"88%",boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>
              Здравствуйте! Я помогу разобраться в наших услугах. Задайте вопрос или выберите тему:
            </div>
            {msgs.length === 0 && (
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {["Тарифы","Доставка","Гарантия"].map(t => (
                  <span key={t} onClick={() => send(t)} style={{ padding:"4px 10px",background:"#eef2ff",color:"var(--accent)",borderRadius:8,fontSize:11,fontWeight:500,cursor:"pointer" }}>{t}</span>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} style={{ display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{
                  background:m.role==="user"?headerColor:"#fff",
                  color:m.role==="user"?"#fff":"#374151",
                  borderRadius:12,
                  borderBottomRightRadius:m.role==="user"?3:12,
                  borderTopLeftRadius:m.role==="ai"?3:12,
                  padding:"9px 11px",fontSize:12,lineHeight:1.55,
                  maxWidth:"85%",boxShadow:"0 1px 3px rgba(0,0,0,.06)",
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ background:"#fff",borderRadius:12,borderTopLeftRadius:3,padding:"9px 11px",boxShadow:"0 1px 3px rgba(0,0,0,.06)",width:"fit-content" }}>
                <span style={dotStyle(0)}/><span style={dotStyle(0.2)}/><span style={dotStyle(0.4)}/>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding:"10px 12px 12px",background:"#fff",borderTop:"1px solid #f1f3f5",flexShrink:0 }}>
            {inputMode === "voice" ? (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:3,height:18 }}>
                  {[6,12,18,10,14,7].map((h,i) => (
                    <div key={i} style={{ width:3,borderRadius:2,background:recording?"var(--accent)":"#9ca3af",height:recording?h:h*0.6,transition:"height .2s",opacity:recording?1:.5 }}/>
                  ))}
                </div>
                <button
                  onClick={() => setRecording(r => !r)}
                  style={{
                    width:52,height:52,borderRadius:"50%",border:"none",
                    background:recording?"#ef4444":headerColor,color:"#fff",
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                    transition:"background .2s",position:"relative",
                  }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/>
                  </svg>
                </button>
                <span style={{ fontSize:10,color:"#9ca3af" }}>Нажмите, чтобы говорить</span>
                <button onClick={() => setInputMode("text")} style={{ fontSize:11,color:"#6b7280",background:"none",border:"none",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:2 }}>
                  Написать текстом
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex",alignItems:"flex-end",gap:8,background:"#f3f4f6",borderRadius:22,padding:"8px 8px 8px 14px",border:"1.5px solid transparent" }}>
                  <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                    placeholder="Спросите что-нибудь..."
                    rows={1}
                    style={{ flex:1,border:"none",background:"transparent",resize:"none",fontSize:13,color:"#111827",fontFamily:"'DM Sans',sans-serif",outline:"none",maxHeight:100 }}
                  />
                  <button onClick={() => setInputMode("voice")} style={{ width:32,height:32,borderRadius:"50%",border:"none",background:"#e5e7eb",color:"#6b7280",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 00-3 3v8a3 3 0 006 0V5a3 3 0 00-3-3z"/></svg>
                  </button>
                  <button onClick={() => send()} disabled={!text.trim()} style={{ width:32,height:32,borderRadius:"50%",border:"none",background:text.trim()?"#111827":"#d1d5db",color:"#fff",cursor:text.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ textAlign:"center",fontSize:9,color:"#d1d5db",padding:4,background:"#fff" }}>
            Powered by GPT Widget
          </div>
        </div>
      )}
    </>
  );
}

function dotStyle(delay) {
  return {
    width:5,height:5,borderRadius:"50%",background:"#9ca3af",
    display:"inline-block",margin:"0 2px",
    animation:`blink 1.2s ${delay}s infinite`,
  };
}
