const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api/v1";

async function request(path, secret, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
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

export const superadminApi = {
  // Verify secret works (try fetching metrics)
  verify: (secret) =>
    request("/superadmin/metrics", secret),

  metrics: (secret) =>
    request("/superadmin/metrics", secret),

  tenants: (secret) =>
    request("/superadmin/tenants", secret),

  tenant: (secret, id) =>
    request(`/superadmin/tenants/${id}`, secret),

  updateTenant: (secret, id, body) =>
    request(`/superadmin/tenants/${id}`, secret, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
