const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : "Что-то пошло не так";
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register: ({ email, password, name }) =>
    request("/clients/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  login: ({ email, password }) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: (token) =>
    request("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
