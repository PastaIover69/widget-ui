import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import AppHeader from "../../components/dashboard/AppHeader";
import StatsGrid from "../../components/dashboard/StatsGrid";
import AssistantsGrid from "../../components/dashboard/AssistantsGrid";
import CreateAssistantModal from "../../components/dashboard/CreateAssistantModal";
import DeleteModal from "../../components/dashboard/DeleteModal";
import RightPanel from "../../components/dashboard/RightPanel";
import WidgetPreview from "../../components/dashboard/WidgetPreview";
import Toast, { useToast } from "../../components/Toast";

const STORAGE_KEY = "gptw_assistants";

function loadAssistants() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveAssistants(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const toast     = useToast();

  const [assistants, setAssistants]       = useState(loadAssistants);
  const [createOpen, setCreateOpen]       = useState(false);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [widgetConfig, setWidgetConfig]   = useState({
    active: true, fabColor: "#4f7ef8", headerColor: "#4f7ef8",
    voiceEnabled: false, assistantId: "",
  });

  // Sync to localStorage whenever assistants change
  useEffect(() => saveAssistants(assistants), [assistants]);

  const name   = user?.name || user?.email || "Пользователь";
  const first  = name.split(" ")[0];

  function handleCreate(newA) {
    setAssistants(list => [...list, newA]);
    toast("Ассистент создан: " + newA.name);
  }

  function handleDelete(a) { setDeleteTarget(a); }

  function confirmDelete() {
    setAssistants(list => list.filter(x => x.id !== deleteTarget.id));
    toast("Ассистент удалён");
    setDeleteTarget(null);
  }

  function handleDuplicate(a) {
    const copy = { ...a, id:"a_"+Date.now(), name:a.name+" (копия)", published:false, dialogs:0, voice:0, updated:"только что", createdAt:new Date().toISOString() };
    setAssistants(list => [...list, copy]);
    toast("Дублировано: " + copy.name);
  }

  function handleRename(a) {
    const name = window.prompt("Новое название:", a.name);
    if (!name || !name.trim()) return;
    setAssistants(list => list.map(x => x.id===a.id ? { ...x, name:name.trim(), letter:name.trim()[0].toUpperCase() } : x));
    toast("Переименовано: " + name.trim());
  }

  function handleOpen(id) {
    navigate("/dashboard/assistant/" + id);
  }

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden" }}>
      <AppHeader onNewAssistant={() => setCreateOpen(true)} />

      <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
        {/* Main scroll area */}
        <main style={{ flex:1,overflowY:"auto" }}>
          <div style={{ maxWidth:1000,margin:"0 auto",padding:"40px 28px" }}>

            {/* Greeting */}
            <div style={{ marginBottom:32,animation:"fadeUp .35s ease both" }}>
              <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:700,letterSpacing:"-.4px",marginBottom:4 }}>
                Здравствуйте, {first}
              </h1>
              <p style={{ fontSize:14,color:"var(--muted)" }}>
                Управляйте своими AI-ассистентами и базами знаний
              </p>
            </div>

            <StatsGrid assistants={assistants} onTopup={() => toast("Раздел тарифов — скоро")} />

            <AssistantsGrid
              assistants={assistants}
              onNew={() => setCreateOpen(true)}
              onOpen={handleOpen}
              onDelete={handleDelete}
              onRename={handleRename}
              onDuplicate={handleDuplicate}
            />
          </div>
        </main>

        <RightPanel
          assistants={assistants}
          widgetConfig={widgetConfig}
          onChange={setWidgetConfig}
        />
      </div>

      {/* Floating widget preview */}
      <WidgetPreview config={widgetConfig} rightPanelWidth={280} />

      {/* Modals */}
      <CreateAssistantModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <DeleteModal
        open={!!deleteTarget}
        assistant={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <Toast />
    </div>
  );
}
