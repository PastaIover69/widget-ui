import { useState } from "react";

const COLORS  = ["#4f7ef8","#7c5cf8","#36c26e","#f0a83a","#f04f5e","#38bdf8"];
const TYPES   = ["Продажи","Поддержка","HR","Консультант","Другое"];
const MODES   = ["Строгий (только база)","Свободный"];
const MODELS  = [
  { value:"haiku",      label:"Claude Haiku 4.5 — быстрый" },
  { value:"sonnet",     label:"Claude Sonnet 4.6 — баланс" },
  { value:"gpt4o-mini", label:"GPT-4o-mini" },
  { value:"deepseek",   label:"DeepSeek V3" },
  { value:"llama",      label:"Groq Llama 3.3" },
];
const PROMPTS = {
  "Продажи":    "Ты — консультант по продажам. Помогай выбрать продукт, отвечай на вопросы о ценах.",
  "Поддержка":  "Ты — специалист поддержки. Решай проблемы пользователей чётко и по делу.",
  "HR":         "Ты — HR-ассистент. Помогай с вопросами по регламентам.",
  "Консультант":"Ты — профессиональный консультант. Давай рекомендации из базы знаний.",
  "Другое":     "Ты — полезный ассистент. Отвечай вежливо и по делу.",
};

export default function CreateAssistantModal({ open, onClose, onCreate }) {
  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({
    name: "", desc: "", type: "Продажи", color: "#4f7ef8",
    prompt: "", greeting: "", model: "haiku", mode: "Строгий (только база)",
  });
  const [nameErr, setNameErr] = useState(false);

  if (!open) return null;

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function goStep2() {
    if (!form.name.trim()) { setNameErr(true); return; }
    set("prompt", form.prompt || PROMPTS[form.type] || PROMPTS["Другое"]);
    set("greeting", form.greeting || "Здравствуйте! Чем могу помочь?");
    setStep(2);
  }

  function handleCreate() {
    if (!form.name.trim()) { setStep(1); setNameErr(true); return; }
    setLoading(true);
    setTimeout(() => {
      const a = {
        id:        "a_" + Date.now(),
        name:      form.name.trim(),
        desc:      form.desc,
        letter:    form.name.trim()[0].toUpperCase(),
        color:     form.color,
        type:      form.type,
        prompt:    form.prompt,
        greeting:  form.greeting,
        model:     form.model,
        mode:      form.mode,
        published: false,
        sources:   0,
        dialogs:   0,
        voice:     0,
        updated:   "только что",
        createdAt: new Date().toISOString(),
      };
      setLoading(false);
      reset(); onClose(); onCreate(a);
    }, 1000);
  }

  function reset() {
    setStep(1); setNameErr(false);
    setForm({ name:"",desc:"",type:"Продажи",color:"#4f7ef8",prompt:"",greeting:"",model:"haiku",mode:"Строгий (только база)" });
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) { reset(); onClose(); } }}
      style={{
        position:"fixed",inset:0,background:"rgba(5,8,18,.78)",
        backdropFilter:"blur(6px)",zIndex:400,
        display:"flex",alignItems:"center",justifyContent:"center",
        animation:"fadeUp .2s ease",
      }}
    >
      <div style={{
        background:"#161b2a",border:"1px solid var(--border-2)",
        borderRadius:20,width:520,maxWidth:"95vw",maxHeight:"90vh",
        overflowY:"auto",
      }}>
        {/* Head */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 26px 0" }}>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:"var(--text)" }}>
            Новый ассистент
          </span>
          <button onClick={() => { reset(); onClose(); }} style={closeBtn}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ padding:"22px 26px 26px" }}>
          {/* Steps */}
          <div style={{ display:"flex",alignItems:"center",marginBottom:24 }}>
            <StepDot n={1} state={step > 1 ? "done" : "active"} label="Основное" active={step===1} />
            <div style={{ flex:1,height:1,background:"var(--border)",margin:"0 6px",maxWidth:36 }} />
            <StepDot n={2} state={step === 2 ? "active" : "pending"} label="Настройка" active={step===2} />
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <Field label="Название ассистента" error={nameErr ? "Введите название" : null}>
                <input
                  value={form.name} autoFocus
                  onChange={e => { set("name", e.target.value); setNameErr(false); }}
                  placeholder="Например: Поддержка клиентов"
                  style={inputStyle(nameErr)}
                />
              </Field>

              <Field label="Тип / роль">
                <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                  {TYPES.map(t => (
                    <Chip key={t} label={t} active={form.type===t} onClick={() => set("type", t)} />
                  ))}
                </div>
              </Field>

              <Field label="Цвет">
                <div style={{ display:"flex",alignItems:"center",gap:14 }}>
                  <div style={{
                    width:46,height:46,borderRadius:13,
                    background:form.color,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:"#fff",
                    transition:"background .2s",
                  }}>
                    {form.name ? form.name[0].toUpperCase() : "A"}
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    {COLORS.map(c => (
                      <ColorSwatch key={c} color={c} selected={form.color===c} onClick={() => set("color", c)} />
                    ))}
                  </div>
                </div>
              </Field>

              <Field label="Описание (необязательно)">
                <textarea
                  value={form.desc} rows={2}
                  onChange={e => set("desc", e.target.value)}
                  placeholder="Кратко опишите задачу ассистента..."
                  style={{ ...inputStyle(), resize:"vertical", minHeight:70 }}
                />
              </Field>

              <div style={{ display:"flex",gap:9,marginTop:22 }}>
                <SecBtn onClick={() => { reset(); onClose(); }}>Отмена</SecBtn>
                <PrimBtn onClick={goStep2}>Далее</PrimBtn>
              </div>
              <button onClick={handleCreate} style={{
                display:"block",width:"100%",marginTop:10,padding:11,
                background:"var(--green)",color:"#fff",fontSize:13,fontWeight:600,
                border:"none",borderRadius:11,cursor:"pointer",fontFamily:"'Syne',sans-serif",
              }}>
                Пропустить шаги и создать
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <Field label="Системный промпт">
                <textarea value={form.prompt} rows={4}
                  onChange={e => set("prompt", e.target.value)}
                  placeholder="Ты — вежливый ассистент компании..."
                  style={{ ...inputStyle(), resize:"vertical", minHeight:90 }}
                />
              </Field>

              <Field label="Приветственное сообщение">
                <input value={form.greeting}
                  onChange={e => set("greeting", e.target.value)}
                  placeholder="Здравствуйте! Чем могу помочь?"
                  style={inputStyle()}
                />
              </Field>

              <Field label="AI-модель">
                <select value={form.model} onChange={e => set("model", e.target.value)}
                  style={{ ...inputStyle(), appearance:"none", cursor:"pointer" }}>
                  {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </Field>

              <Field label="Режим">
                <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                  {MODES.map(m => (
                    <Chip key={m} label={m} active={form.mode===m} onClick={() => set("mode", m)} />
                  ))}
                </div>
              </Field>

              <div style={{ display:"flex",gap:9,marginTop:22 }}>
                <SecBtn onClick={() => setStep(1)}>Назад</SecBtn>
                <PrimBtn loading={loading} onClick={handleCreate}>
                  {loading ? "Создаём…" : "Создать ассистента"}
                </PrimBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── small helpers ──────────────────────────────

function StepDot({ n, state, label, active }) {
  const bg = state==="done" ? "var(--green)" : state==="active" ? "var(--accent)" : "var(--border)";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:7 }}>
      <div style={{ width:22,height:22,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",fontFamily:"'Syne',sans-serif" }}>
        {state==="done"
          ? <svg width="10" height="8" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : n}
      </div>
      <span style={{ fontSize:12,color:active?"var(--text)":"var(--muted)",fontWeight:active?500:400 }}>{label}</span>
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block",fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:7 }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize:11,color:"var(--red)",marginTop:4 }}>{error}</div>}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding:"6px 13px",borderRadius:8,fontSize:12,fontWeight:500,
      border:`1px solid ${active?"rgba(79,126,248,.35)":"var(--border)"}`,
      background:active?"rgba(79,126,248,.12)":"var(--surface)",
      color:active?"var(--accent)":"var(--muted)",
      cursor:"pointer",transition:"all .15s",fontFamily:"'DM Sans',sans-serif",
    }}>
      {label}
    </div>
  );
}

function ColorSwatch({ color, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      width:30,height:30,borderRadius:"50%",background:color,cursor:"pointer",
      border:`2.5px solid ${selected?"rgba(255,255,255,.6)":"transparent"}`,
      boxShadow:selected?"0 0 0 3px rgba(255,255,255,.08)":"none",
      position:"relative",transition:"all .15s",
    }}>
      {selected && (
        <div style={{ position:"absolute",inset:6,background:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l3 3 5-6' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") center/contain no-repeat" }} />
      )}
    </div>
  );
}

function PrimBtn({ onClick, children, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      flex:1,padding:11,background:"var(--accent)",color:"#fff",
      fontSize:13,fontWeight:600,border:"none",borderRadius:11,
      cursor:loading?"not-allowed":"pointer",opacity:loading?.6:1,
      transition:"opacity .15s",fontFamily:"'Syne',sans-serif",
    }}>
      {loading ? <><span style={{ display:"inline-block",width:13,height:13,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite",verticalAlign:"middle",marginRight:5 }}/> Создаём...</> : children}
    </button>
  );
}

function SecBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding:"11px 18px",background:"var(--border)",color:"var(--subtle)",
      fontSize:13,fontWeight:500,border:"none",borderRadius:11,
      cursor:"pointer",transition:"all .15s",fontFamily:"'DM Sans',sans-serif",
    }}>
      {children}
    </button>
  );
}

function inputStyle(err) {
  return {
    width:"100%",background:"var(--surface)",
    border:`1px solid ${err?"var(--red)":"var(--border)"}`,
    borderRadius:11,padding:"11px 13px",fontSize:13,
    color:"var(--text)",fontFamily:"'DM Sans',sans-serif",
    outline:"none",
  };
}

const closeBtn = {
  width:28,height:28,borderRadius:8,border:"none",background:"var(--border)",
  color:"var(--subtle)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
};
const CloseIcon = () => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);
