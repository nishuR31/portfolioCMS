/**
 * api.js — Frontend API service layer
 *
 * TOKEN SECURITY MODEL:
 * ─────────────────────────────────────────────
 * • accessToken  → httpOnly cookie (1d). Set by backend on login/register/refresh.
 *                  Browser sends it automatically. Survives hot-reloads & refreshes.
 *                  JS cannot read it — intentional.
 *
 * • refreshToken → httpOnly cookie (7d). Used by backend to issue new accessToken
 *                  when the old one expires. JS cannot read or write it.
 *
 * • user object  → sessionStorage only (cleared when the tab is closed).
 *                  Only contains display data (name, email, id) — no secrets.
 *
 * Every request uses  credentials: "true"  so both cookies are sent automatically.
 * The frontend NEVER stores, reads, or manages tokens directly.
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = `${BACKEND_URL}/api/v1`;
// ─── User display state (non-sensitive) ──────────────────────────────────────
let _user = null;

try {
  const raw = sessionStorage.getItem("portfolio_user");
  if (raw) _user = JSON.parse(raw);
} catch {
  sessionStorage.removeItem("portfolio_user");
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/** Call after login/register with the user object from the JSON response */
export const setAuthSession = (user) => {
  _user = user;
  if (user) sessionStorage.setItem("portfolio_user", JSON.stringify(user));
  else sessionStorage.removeItem("portfolio_user");
};

/** Clear local user state. The backend clears the cookies on /logout. */
export const clearAuthSession = () => {
  _user = null;
  sessionStorage.removeItem("portfolio_user");
};

export const getCurrentUser = () => _user;

// ─── Silent token refresh ─────────────────────────────────────────────────────
let _refreshing = null;

/**
 * Hits POST /auth/refresh-token — browser sends the refreshToken cookie automatically.
 * Backend rotates both cookies and returns new accessToken (for JSON callers).
 */
async function silentRefresh() {
  if (_refreshing) return _refreshing;

  _refreshing = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        clearAuthSession();
        window.dispatchEvent(new CustomEvent("auth-expired"));
        return false;
      }
      return true;
    } catch {
      clearAuthSession();
      window.dispatchEvent(new CustomEvent("auth-expired"));
      return false;
    } finally {
      _refreshing = null;
    }
  })();

  return _refreshing;
}

// ─── Core request wrapper ─────────────────────────────────────────────────────

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // always send cookies (accessToken + refreshToken)
  };

  let response = await fetch(url, config);

  // ── Auto-refresh on 401 (once) ──────────────────────────────────────────────
  if (response.status === 401 && !options._isRetry) {
    const refreshed = await silentRefresh();
    if (refreshed) {
      // Retry with the freshly rotated accessToken cookie
      response = await fetch(url, { ...config, _isRetry: true });
    } else {
      const err = new Error("Session expired. Please log in again.");
      err.status = 401;
      throw err;
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.message || `Request failed (${response.status})`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ─── API surface ──────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (body) =>
      request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

    login: (body) =>
      request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

    logout: () =>
      request("/auth/logout", { method: "POST" }),

    changePassword: (body) =>
      request("/auth/change-password", { method: "POST", body: JSON.stringify(body) }),

    enableTotp: (body) =>
      request("/auth/totp/enable", { method: "POST", body: JSON.stringify(body) }),

    verifyTotp: (body) =>
      request("/auth/totp/verify", { method: "POST", body: JSON.stringify(body) }),

    disableTotp: (body) =>
      request("/auth/totp/disable", { method: "POST", body: JSON.stringify(body) }),
  },

  portfolio: {
    // ── Public (no auth needed) ────────────────────────────────────────────
    getFull: (userId) => request(`/portfolio/user/${userId}`),
    getProfile: (userId) => request(`/portfolio/user/${userId}/profile`),
    getEducation: (userId) => request(`/portfolio/user/${userId}/education`),
    getExperience: (userId) => request(`/portfolio/user/${userId}/experience`),
    getProjects: (userId) => request(`/portfolio/user/${userId}/projects`),
    getHackathons: (userId) => request(`/portfolio/user/${userId}/hackathons`),
    getSkills: (userId) => request(`/portfolio/user/${userId}/skills`),
    getCertifications: (userId) => request(`/portfolio/user/${userId}/certifications`),
    getAchievements: (userId) => request(`/portfolio/user/${userId}/achievements`),

    // ── Authenticated CRUD ─────────────────────────────────────────────────
    upsertProfile: (body) =>
      request("/portfolio/profile", { method: "PUT", body: JSON.stringify(body) }),

    createEducation: (body) =>
      request("/portfolio/education", { method: "POST", body: JSON.stringify(body) }),
    updateEducation: (id, body) =>
      request(`/portfolio/education/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteEducation: (id) =>
      request(`/portfolio/education/${id}`, { method: "DELETE" }),

    createExperience: (body) =>
      request("/portfolio/experience", { method: "POST", body: JSON.stringify(body) }),
    updateExperience: (id, body) =>
      request(`/portfolio/experience/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteExperience: (id) =>
      request(`/portfolio/experience/${id}`, { method: "DELETE" }),

    createProject: (body) =>
      request("/portfolio/projects", { method: "POST", body: JSON.stringify(body) }),
    updateProject: (id, body) =>
      request(`/portfolio/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteProject: (id) =>
      request(`/portfolio/projects/${id}`, { method: "DELETE" }),

    createHackathon: (body) =>
      request("/portfolio/hackathons", { method: "POST", body: JSON.stringify(body) }),
    updateHackathon: (id, body) =>
      request(`/portfolio/hackathons/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteHackathon: (id) =>
      request(`/portfolio/hackathons/${id}`, { method: "DELETE" }),

    createSkill: (body) =>
      request("/portfolio/skills", { method: "POST", body: JSON.stringify(body) }),
    updateSkill: (id, body) =>
      request(`/portfolio/skills/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteSkill: (id) =>
      request(`/portfolio/skills/${id}`, { method: "DELETE" }),

    createCertification: (body) =>
      request("/portfolio/certifications", { method: "POST", body: JSON.stringify(body) }),
    updateCertification: (id, body) =>
      request(`/portfolio/certifications/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteCertification: (id) =>
      request(`/portfolio/certifications/${id}`, { method: "DELETE" }),

    createAchievement: (body) =>
      request("/portfolio/achievements", { method: "POST", body: JSON.stringify(body) }),
    updateAchievement: (id, body) =>
      request(`/portfolio/achievements/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteAchievement: (id) =>
      request(`/portfolio/achievements/${id}`, { method: "DELETE" }),
  },
};
