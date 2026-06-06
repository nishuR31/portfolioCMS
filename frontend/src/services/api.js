const BACKEND_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const BASE_URL = `${BACKEND_URL}/api/v1`;

let _user = null;
let _refreshPromise = null;

export const getCurrentUser = () => _user;
export const setAuthSession = (user) => { _user = user; };
export const clearAuthSession = () => { _user = null; };

export const setCurrentUser = (user) => {
  _user = user;
};

async function silentRefresh() {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        _user = null;

        window.dispatchEvent(
          new CustomEvent("auth-expired")
        );

        return false;
      }

      return true;
    } catch {
      _user = null;

      window.dispatchEvent(
        new CustomEvent("auth-expired")
      );

      return false;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

async function request(
  path,
  options = {},
  isRetry = false
) {
  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  if (response.status === 401 && !isRetry) {
    const refreshed = await silentRefresh();

    if (refreshed) {
      return request(path, options, true);
    }

    const err = new Error(
      "Session expired. Please login again."
    );
    err.status = 401;
    throw err;
  }

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    const err = new Error(
      data.message ||
      `Request failed (${response.status})`
    );

    err.status = response.status;
    err.data = data;

    throw err;
  }

  return data;
}

export const api = {
  auth: {
    register: (body) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: async (body) => {
      const data = await request(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      if (data?.data?.user)
        _user = data.data.user;

      return data;
    },

    me: async () => {
      const data = await request("/auth/me");

      if (data?.data?.user)
        _user = data.data.user;

      return data;
    },

    logout: async () => {
      const data = await request(
        "/auth/logout",
        {
          method: "POST",
        }
      );

      _user = null;

      return data;
    },

    changePassword: (body) =>
      request("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    enableTotp: (body) =>
      request("/auth/totp/enable", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    verifyTotp: (body) =>
      request("/auth/totp/verify", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    disableTotp: (body) =>
      request("/auth/totp/disable", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  portfolio: {
    getFull: (userId) =>
      request(`/portfolio/user/${userId}`),

    getProfile: (userId) =>
      request(
        `/portfolio/user/${userId}/profile`
      ),

    getEducation: (userId) =>
      request(
        `/portfolio/user/${userId}/education`
      ),

    getExperience: (userId) =>
      request(
        `/portfolio/user/${userId}/experience`
      ),

    getProjects: (userId) =>
      request(
        `/portfolio/user/${userId}/projects`
      ),

    getHackathons: (userId) =>
      request(
        `/portfolio/user/${userId}/hackathons`
      ),

    getSkills: (userId) =>
      request(
        `/portfolio/user/${userId}/skills`
      ),

    getCertifications: (userId) =>
      request(
        `/portfolio/user/${userId}/certifications`
      ),

    getAchievements: (userId) =>
      request(
        `/portfolio/user/${userId}/achievements`
      ),

    upsertProfile: (body) =>
      request("/portfolio/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    createEducation: (body) =>
      request("/portfolio/education", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateEducation: (id, body) =>
      request(`/portfolio/education/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    deleteEducation: (id) =>
      request(`/portfolio/education/${id}`, {
        method: "DELETE",
      }),

    createExperience: (body) =>
      request("/portfolio/experience", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateExperience: (id, body) =>
      request(`/portfolio/experience/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    deleteExperience: (id) =>
      request(`/portfolio/experience/${id}`, {
        method: "DELETE",
      }),

    createProject: (body) =>
      request("/portfolio/projects", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateProject: (id, body) =>
      request(`/portfolio/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    deleteProject: (id) =>
      request(`/portfolio/projects/${id}`, {
        method: "DELETE",
      }),

    createHackathon: (body) =>
      request("/portfolio/hackathons", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateHackathon: (id, body) =>
      request(`/portfolio/hackathons/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    deleteHackathon: (id) =>
      request(`/portfolio/hackathons/${id}`, {
        method: "DELETE",
      }),

    createSkill: (body) =>
      request("/portfolio/skills", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateSkill: (id, body) =>
      request(`/portfolio/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),

    deleteSkill: (id) =>
      request(`/portfolio/skills/${id}`, {
        method: "DELETE",
      }),

    createCertification: (body) =>
      request("/portfolio/certifications", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateCertification: (id, body) =>
      request(
        `/portfolio/certifications/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      ),

    deleteCertification: (id) =>
      request(
        `/portfolio/certifications/${id}`,
        {
          method: "DELETE",
        }
      ),

    createAchievement: (body) =>
      request("/portfolio/achievements", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateAchievement: (id, body) =>
      request(
        `/portfolio/achievements/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
        }
      ),

    deleteAchievement: (id) =>
      request(
        `/portfolio/achievements/${id}`,
        {
          method: "DELETE",
        }
      ),
  },
};