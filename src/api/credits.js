const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

async function request(path, token, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : "Ошибка запроса";
    throw new Error(msg);
  }
  return data;
}

export const creditsApi = {
  summary: (token) => request("/credits/summary", token),
  history: (token, limit = 20, offset = 0) =>
    request(`/credits/history?limit=${limit}&offset=${offset}`, token),
};
