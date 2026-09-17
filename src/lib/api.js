const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const tokenStore = {
  get: () => sessionStorage.getItem("sifi_token"),
  set: (token, remember = false) => {
    sessionStorage.setItem("sifi_token", token);
    if (remember) localStorage.setItem("sifi_token", token);
  },
  clear: () => {
    sessionStorage.removeItem("sifi_token");
    localStorage.removeItem("sifi_token");
  },
  hydrate: () => {
    const remembered = localStorage.getItem("sifi_token");
    if (remembered && !sessionStorage.getItem("sifi_token")) sessionStorage.setItem("sifi_token", remembered);
  }
};

export async function api(path, options = {}) {
  tokenStore.hydrate();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  if (options.raw) return response;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new Error(payload.message || "Request failed");
  return payload.data;
}

export async function uploadFile(scope, file) {
  tokenStore.hydrate();
  tokenStore.hydrate();
  const formData = new FormData();
  formData.append("file", file);
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try { response = await fetch(`${API_BASE_URL}/admin/uploads/${scope}`, {
    method: "POST",
    headers,
    body: formData
  }); } catch { throw new Error("Unable to reach the upload server. Check your connection and make sure the backend is running."); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new Error(response.status === 401 ? "Your session has expired. Sign in again before uploading." : payload.message || "Upload failed");
  return payload.data;
}

export function assetUrl(value) {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("/images/")) return value;
  const apiOrigin = new URL(API_BASE_URL, typeof window === "undefined" ? "http://localhost" : window.location.origin).origin;
  return value.startsWith("/") ? `${apiOrigin}${value}` : value;
}

export { API_BASE_URL };
