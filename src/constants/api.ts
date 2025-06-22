const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const API_ENDPOINTS = {
  ADMIN: {
    VOCABULARIES: {
      UPDATE: (id: string) => `${BASE_URL}/admin/vocabularies/${id}`,
      DELETE: (id: string) => `${BASE_URL}/admin/vocabularies/${id}`,
    },
  },

  VOCABULARIES: {
    BASE: `${BASE_URL}/vocabularies`,
    DASHBOARD: (user_id: string) =>
      `${BASE_URL}/dashboard/vocab-stats?user_id=${user_id}`,
    CREATE: `${BASE_URL}/vocabularies`,
    GET_ALL: `${BASE_URL}/vocabularies`,
    GET_BY_ID: (id: string) => `${BASE_URL}/vocabularies/${id}`,
  },
  // Add other endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    // etc...
  },
};

export default API_ENDPOINTS;
