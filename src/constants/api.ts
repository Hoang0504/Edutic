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
    BY_CONTEXT: (context: string, user_id?: string, set?: string) =>
      `${BASE_URL}/vocabularies/by-context?context=${context}${
        user_id ? `&user_id=${user_id}` : ""
      }${set ? `&set=${set}` : ""}`,
    BY_DATE: (user_id: string, date: string, set?: string) =>
      `${BASE_URL}/vocabularies/by-date?user_id=${user_id}&date=${date}${
        set ? `&set=${set}` : ""
      }`,
  },

  EXAM_ATTEMPTS: {
    INFO: (id: string) => `${BASE_URL}/exam-attempts/${id}/info`,
    DETAILS: (id: string) => `${BASE_URL}/exam-attempts/${id}/details`,
    PART: (id: string, partNumber: string) =>
      `${BASE_URL}/exam-attempts/${id}/parts/${partNumber}/overview`,
    QUESTION_DETAILS: (id: string, questionId: string) =>
      `${BASE_URL}/exam-attempts/${id}/questions/${questionId}/details`,
    SUBMIT: (id: string) => `${BASE_URL}/exam-attempts/${id}/submit`,
    CANCEL: (id: string) => `${BASE_URL}/exam-attempts/${id}/cancel`,
    RECENT: `${BASE_URL}/exam-attempts/recent`,
  },

  PART: {
    DETAIL: (id: string) => `${BASE_URL}/part/${id}`,
  },

  EXAM: {
    START: (id: string) => `${BASE_URL}/exam/${id}/start`,
    PARTS: (id: string) => `${BASE_URL}/exam/${id}/parts`,
    INFO: `${BASE_URL}/exam/info`,
  },

  EXAMS: `${BASE_URL}/exams`,

  // Add other endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/api/auth/login`,
    // etc...
  },
};

export default API_ENDPOINTS;
