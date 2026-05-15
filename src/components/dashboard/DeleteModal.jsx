import { useState } from "react";

export default function DeleteModal({ open, assistant, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  if (!open || !assistant) return null;

  function confirm() {
    setLoading(true);
    setTimeout(() => { setLoading(false); onConfirm(); }, 900);
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:"fixed",inset:0,background:"rgba(5,8,18,.78)",
        backdropFilter:"blur(6px)",zIndex:400,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}
    >
      <div style={{
        background:"#161b2a",border:"1px solid var(--border-2)",
        borderRadius:20,width:420,maxWidth:"95vw",padding:"22px 26px 26px",
      }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:"var(--text)" }}>
            Удалить ассистента
          </span>
          <button onClick={onClose} style={{ width:28,height:28,borderRadius:8,border:"none",background:"var(--border)",color:"var(--subtle)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <p style={{ fontSize:14,color:"var(--subtle)",lineHeight:1.65,marginBottom:22 }}>
          Вы собираетесь удалить ассистента{" "}
          <strong style={{ color:"var(--text)" }}>{assistant.name}</strong>.{" "}
          Действие необратимо.
        </p>
        <div style={{ display:"flex",gap:9 }}>
          <button onClick={onClose} style={{ padding:"11px 18px",background:"var(--border)",color:"var(--subtle)",fontSize:13,border:"none",borderRadius:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif" }}>
            Отмена
          </button>
          <button onClick={confirm} disabled={loading} style={{ flex:1,padding:11,background:"var(--red)",color:"#fff",fontSize:13,fontWeight:600,border:"none",borderRadius:11,cursor:loading?"not-allowed":"pointer",opacity:loading?.7:1,fontFamily:"'Syne',sans-serif" }}>
            {loading ? "Удаляем…" : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}
