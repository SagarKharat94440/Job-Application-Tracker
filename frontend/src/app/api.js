import { environment } from "../environments/environment.js";

const API = environment.apiBaseUrl;

let refreshInFlight = null;

async function refreshAccessToken() {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const data = await response.json();
        const token = data?.token || data?.accessToken;
        if (!token) return false;
        localStorage.setItem("jobtracker-token", token);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

async function request(path, options = {}, allowRefresh = true) {
  const token = localStorage.getItem("jobtracker-token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData))
    headers.set("Content-Type", "application/json");

  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (networkError) {
    // Backend is unreachable — clear session and redirect to login
    if (token && !path.startsWith("/api/auth/login") && !path.startsWith("/api/auth/signup")) {
      localStorage.removeItem("jobtracker-token");
      window.location.hash = "/login";
    }
    throw new Error("Unable to connect to the server. Please try again later.");
  }

  if (
    response.status === 401 &&
    allowRefresh &&
    !path.startsWith("/api/auth/")
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request(path, options, false);
    localStorage.removeItem("jobtracker-token");
    window.location.hash = "/login";
  }
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

export const api = {
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  signup: (body) =>
    request("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  profile: () => request("/api/auth/me"),
  updateProfile: (form) =>
    request("/api/auth/profile", { method: "PUT", body: form }),
  changePassword: (body) =>
    request("/api/auth/password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  forgotPassword: (email) =>
    request(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: "POST",
    }),
  resetPassword: (body) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verifyEmail: (token) =>
    request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  dashboard: () => request("/api/jobs/dashboard"),
  jobs: (params = {}) => request(`/api/jobs?${new URLSearchParams(params)}`),
  createJob: (job) =>
    request("/api/jobs", { method: "POST", body: JSON.stringify(job) }),
  updateJob: (id, job) =>
    request(`/api/jobs/${id}`, { method: "PUT", body: JSON.stringify(job) }),
  deleteJob: (id) => request(`/api/jobs/${id}`, { method: "DELETE" }),
  resources: (params = {}) =>
    request(`/api/resources?${new URLSearchParams(params)}`),
  myResources: () => request("/api/resources/mine"),
  createResource: (resource) =>
    request("/api/resources", {
      method: "POST",
      body: JSON.stringify(resource),
    }),
  uploadResource: (form) =>
    request("/api/resources/upload", { method: "POST", body: form }),
  deleteResource: (id) => request(`/api/resources/${id}`, { method: "DELETE" }),
  gmailConnect: (code) =>
    request("/api/integrations/gmail/connect", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  gmailDisconnect: () =>
    request("/api/integrations/gmail/disconnect", { method: "POST" }),
  gmailSync: () => request("/api/integrations/gmail/sync", { method: "POST" }),
};
