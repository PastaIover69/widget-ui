import { useState, useCallback, useEffect, useRef } from "react";

let _showToast = null;

export function useToast() {
  return useCallback((msg, type = "info") => {
    if (_showToast) _showToast(msg, type);
  }, []);
}

export default function Toast() {
  const [state, setState] = useState({ msg: "", visible: false, type: "info" });
  const timerRef = useRef(null);

  useEffect(() => {
    _showToast = (msg, type = "info") => {
      clearTimeout(timerRef.current);
      setState({ msg, visible: true, type });
      timerRef.current = setTimeout(
        () => setState((s) => ({ ...s, visible: false })),
        2800
      );
    };
    return () => { _showToast = null; };
  }, []);

  const colors = {
    info:  "var(--border-2)",
    error: "rgba(240,79,94,0.15)",
    success: "rgba(58,201,122,0.15)",
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 28,
      left: "50%",
      transform: `translateX(-50%) translateY(${state.visible ? 0 : 20}px)`,
      background: colors[state.type],
      color: "var(--text)",
      fontSize: 13,
      padding: "11px 20px",
      borderRadius: 50,
      border: "1px solid var(--border-2)",
      opacity: state.visible ? 1 : 0,
      transition: "all .3s",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      zIndex: 10000,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {state.msg}
    </div>
  );
}
