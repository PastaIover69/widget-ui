import { useState } from "react";
import Field from "../components/Field.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import { useRegister } from "../hooks/useAuthForm.js";

const UserIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);
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

function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const colors = ["", "#f04f5e", "#f0a83a", "#f0a83a", "#3ac97a"];
  const labels = ["", "Слабый", "Средний", "Хороший", "Надёжный"];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 4, background: i <= score ? colors[score] : "var(--border)", transition: "background .2s" }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color: colors[score] || "var(--muted)" }}>
        {labels[score]}
      </span>
    </div>
  );
}

export default function RegisterPanel({ onSwitch, onSuccess }) {
  const { register, loading, error, clearError } = useRegister();

  const [form, setForm]   = useState({ name: "", email: "", password: "", agree: false });
  const [errors, setErrors] = useState({});

  function set(field) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm(f => ({ ...f, [field]: value }));
      setErrors(er => ({ ...er, [field]: null }));
      clearError();
    };
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Введите ваше имя";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Введите корректный email";
    if (form.password.length < 8) e.password = "Минимум 8 символов";
    if (!form.agree) e.agree = "Примите условия использования";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.success) {
      // Pass keys up so parent can show them once
      onSuccess?.({ api_key: result.api_key, widget_key: result.widget_key });
    }
  }

  return (
    <div style={{ animation: "fadeUp .25s ease" }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: -0.3 }}>
        Создать аккаунт
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>
        Начните работу с GPT Widget бесплатно
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Имя" type="text" placeholder="Виктор Иванов"
          value={form.name} onChange={set("name")} error={errors.name}
          icon={<UserIcon />} autoComplete="name" />

        <Field label="Email" type="email" placeholder="viktor@company.ru"
          value={form.email} onChange={set("email")} error={errors.email}
          icon={<EmailIcon />} autoComplete="email" />

        <div style={{ marginBottom: 16 }}>
          <Field label="Пароль" type="password" placeholder="Минимум 8 символов"
            value={form.password} onChange={set("password")} error={errors.password}
            icon={<LockIcon />} autoComplete="new-password" />
          <PasswordStrength password={form.password} />
        </div>

        {error && (
          <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Agree */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: errors.agree ? "var(--red)" : "var(--subtle)", userSelect: "none" }}>
            <input type="checkbox" checked={form.agree} onChange={set("agree")} style={{ display: "none" }} />
            <span style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
              border: `1.5px solid ${errors.agree ? "var(--red)" : form.agree ? "var(--accent)" : "var(--border-2)"}`,
              background: form.agree ? "var(--accent)" : "var(--surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}>
              {form.agree && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            Я принимаю{" "}
            <a href="#" style={{ color: "var(--accent)", marginLeft: 4 }}>условия использования</a>
          </label>
        </div>

        <SubmitButton loading={loading}>Создать аккаунт</SubmitButton>
      </form>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        Уже есть аккаунт?{" "}
        <button onClick={onSwitch} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
          Войти
        </button>
      </div>
    </div>
  );
}
