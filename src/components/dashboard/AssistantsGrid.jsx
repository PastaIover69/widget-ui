import { useState } from "react";

const COLORS = ["#4f7ef8","#7c5cf8","#36c26e","#f0a83a","#f04f5e","#38bdf8"];

export default function AssistantsGrid({ assistants, onNew, onOpen, onDelete, onRename, onDuplicate }) {
  return (
    <div>
      <div style={{ marginBottom: 16, animation: "fadeUp .4s .1s ease both" }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>
          Ваши ассистенты
        </span>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 12, animation: "fadeUp .4s .14s ease both",
      }}>
        {/* New card */}
        <NewCard onClick={onNew} />
        {assistants.map(a => (
          <AssistantCard
            key={a.id} assistant={a}
            onOpen={() => onOpen(a.id)}
            onDelete={() => onDelete(a)}
            onRename={() => onRename(a)}
            onDuplicate={() => onDuplicate(a)}
          />
        ))}
        {assistants.length === 0 && <EmptyState onNew={onNew} />}
      </div>
    </div>
  );
}

function NewCard({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "transparent",
        border: `2px dashed ${hover ? "var(--accent)" : "var(--border-2)"}`,
        borderRadius: "var(--radius)", padding: 22, minHeight: 190,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "border-color .2s",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: "50%",
        background: hover ? "var(--border-2)" : "var(--card)",
        color: hover ? "var(--subtle)" : "var(--muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 10, transition: "all .2s",
      }}>
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
      </div>
      <div style={{ fontSize: 13, color: hover ? "var(--subtle)" : "var(--muted)", transition: "color .2s" }}>
        Создать ассистента
      </div>
    </div>
  );
}

function AssistantCard({ assistant: a, onOpen, onDelete, onRename, onDuplicate }) {
  const [hover, setHover]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos]   = useState({ x: 0, y: 0 });

  function openMenu(e) {
    e.stopPropagation();
    setMenuPos({ x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY + 4, window.innerHeight - 230) });
    setMenuOpen(true);
  }

  return (
    <>
      <div
        onClick={onOpen}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "var(--card)",
          border: `1px solid ${hover ? "var(--border-2)" : "var(--border)"}`,
          borderRadius: "var(--radius)", padding: 18, minHeight: 190,
          display: "flex", flexDirection: "column",
          cursor: "pointer", position: "relative",
          transition: "border-color .2s, transform .15s",
          transform: hover ? "translateY(-1px)" : "none",
        }}
      >
        {/* Three-dot menu */}
        <button
          onClick={openMenu}
          style={{
            position: "absolute", top: 11, right: 11,
            width: 28, height: 28, borderRadius: 7,
            border: "none", background: hover ? "transparent" : "transparent",
            cursor: "pointer", color: "var(--muted)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hover ? 1 : 0, transition: "opacity .15s",
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="5" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="19" r="1" fill="currentColor"/>
          </svg>
        </button>

        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: a.color || "#4f7ef8",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
          color: "#fff", marginBottom: 14, flexShrink: 0,
        }}>
          {a.letter || (a.name || "A")[0].toUpperCase()}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4, lineHeight: 1.3 }}>
          {a.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14 }}>
          {a.sources || 0} источников · {a.updated || "только что"}
        </div>

        <div style={{ marginTop: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "4px 9px", borderRadius: 7, fontSize: 10, fontWeight: 600,
            background: a.published ? "rgba(54,194,110,.1)" : "var(--border)",
            color: a.published ? "var(--green)" : "var(--muted)",
          }}>
            {a.published && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />}
            {a.published ? "Активен" : "Виджет"}
          </span>
        </div>
      </div>

      {/* Context menu */}
      {menuOpen && (
        <ContextMenu
          x={menuPos.x} y={menuPos.y}
          onClose={() => setMenuOpen(false)}
          onOpen={onOpen}
          onRename={onRename}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

function ContextMenu({ x, y, onClose, onOpen, onRename, onDuplicate, onDelete }) {
  function act(fn) { onClose(); fn(); }

  // Close on outside click
  const ref = (el) => {
    if (!el) return;
    const handler = (e) => { if (!el.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
  };

  return (
    <div ref={ref} style={{
      position: "fixed", left: x, top: y,
      background: "#1a2035", border: "1px solid var(--border-2)",
      borderRadius: 12, padding: 5, minWidth: 176,
      boxShadow: "0 16px 48px rgba(0,0,0,.5)",
      zIndex: 500, animation: "fadeDown .15s ease",
    }}>
      <MenuItem icon={<OpenIcon />} label="Открыть"     onClick={() => act(onOpen)} />
      <MenuItem icon={<RenameIcon />} label="Переименовать" onClick={() => act(onRename)} />
      <MenuItem icon={<DupIcon />}  label="Дублировать" onClick={() => act(onDuplicate)} />
      <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
      <MenuItem icon={<TrashIcon />} label="Удалить" danger onClick={() => act(onDelete)} />
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "8px 12px", borderRadius: 8, fontSize: 12,
        color: danger ? "var(--red)" : hover ? "var(--text)" : "var(--subtle)",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        background: hover ? (danger ? "rgba(240,79,94,.08)" : "var(--border)") : "transparent",
        transition: "all .1s",
      }}
    >
      {icon}{label}
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div style={{
      gridColumn: "1 / -1", display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center", padding: "60px 32px",
    }}>
      <div style={{
        width: 68, height: 68, borderRadius: 18,
        background: "var(--card)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18,
      }}>
        <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.7-1.4 2.4l-2-.5m-13.6.1L4.2 19.7c-1 1-.03 2.7 1.4 2.4l2-.5"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
        Нет ассистентов
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, maxWidth: 300, lineHeight: 1.6 }}>
        Создайте первого AI-ассистента. Это займёт меньше минуты.
      </div>
      <button onClick={onNew} style={{
        display: "flex", alignItems: "center", gap: 7, padding: "8px 20px",
        background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600,
        border: "none", borderRadius: 50, cursor: "pointer",
        fontFamily: "'Syne',sans-serif", boxShadow: "0 4px 16px rgba(79,126,248,.25)",
      }}>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Создать ассистента
      </button>
    </div>
  );
}

const OpenIcon   = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>;
const RenameIcon = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>;
const DupIcon    = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>;
const TrashIcon  = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>;
