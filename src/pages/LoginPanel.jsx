import { useState } from "react";
import Field from "../components/Field.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import { useLogin } from "../hooks/useAuthForm.js";

const EmailIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
  </svg>
);

export default function LoginPanel({ onSwitch, onForgot }) {
  const { login, loading, error, clearError } = useLogin();

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});

  function set(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(er => ({ ...er, [field]: null }));
      clearError();
    };
  }

  function validate() {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Введите корректный email";
    if (form.password.length < 3) e.password = "Введите пароль";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await login({ email: form.email, password: form.password, remember: form.remember });
    // Redirect handled by AuthContext / App router
  }

  return (
    <div style={{ animation: "fadeUp .25s ease" }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: -0.3 }}>
        С возвращением
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>
        Войдите в свой аккаунт GPT Widget
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          placeholder="viktor@company.ru"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          icon={<EmailIcon />}
          autoComplete="email"
        />
        <Field
          label="Пароль"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={set("password")}
          error={errors.password || (error ? " " : null)}
          icon={<LockIcon />}
          autoComplete="current-password"
        />

        {/* API error */}
        {error && (
          <div style={{ fontSize: 12, color: "var(--red)", marginTop: -8, marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Remember + forgot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--subtle)", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              style={{ display: "none" }}
            />
            <span style={{
              width: 18, height: 18, borderRadius: 5,
              border: `1.5px solid ${form.remember ? "var(--accent)" : "var(--border-2)"}`,
              background: form.remember ? "var(--accent)" : "var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s", flexShrink: 0,
            }}>
              {form.remember && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            Запомнить меня
          </label>
          <button type="button" onClick={onForgot} style={{ fontSize: 13, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            Забыли пароль?
          </button>
        </div>

        <SubmitButton loading={loading}>Войти в систему</SubmitButton>
      </form>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        Нет аккаунта?{" "}
        <button onClick={onSwitch} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
}
