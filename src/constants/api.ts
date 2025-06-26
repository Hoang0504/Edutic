const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const API_ENDPOINTS = {
  ADMIN: {
    VOCABULARIES: {
      UPDATE: (id: string) => `${BASE_URL}/admin/vocabularies/${id}`,
      DELETE: (id: string) => `${BASE_URL}/admin/vocabularies/${id}`,
    },
  },

  FLASHCARDS: {
    DASHBOARD: (user_id: string | undefined) =>
      `${BASE_URL}/flashcards/dashboard/vocab-stats?user_id=${user_id}`,
    GROUP_BY_CONTEXT: (user_id?: string) =>
      `${BASE_URL}/flashcards/group-by-context${
        user_id ? `?user_id=${user_id}` : ""
      }`,
    DUE_GROUP_BY_DATE: (user_id: string) =>
      `${BASE_URL}/flashcards/due-group-by-date?user_id=${user_id}`,
  },

  VOCABULARIES: {
    BASE: `${BASE_URL}/vocabularies`,
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
