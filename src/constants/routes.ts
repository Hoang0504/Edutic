const BASE_URL = "/";

const ROUTES = {
  BASE_URL: BASE_URL,
  AUTH: {
    LOGIN: `${BASE_URL}login`,
  },
  FLASHCARDS: {
    CONTEXT_LIST: `${BASE_URL}flashcards/context-list`,
    USER_CONTEXT_LIST: (userId: string) =>
      `${BASE_URL}flashcards/context-list?user_id=${userId}`,
  },
  VOCABULARIES: {
    QUIZLET: `${BASE_URL}vocabularies/quizlet`,
  },
  EXAM_ATTEMPT: {
    DO: (id: string) => `${BASE_URL}exam-attempt/${id}`,
    RESULT: (id: string) => `${BASE_URL}exam-attempt/${id}/results`,
  },
  EXAM: {
    OVERVIEW: (id: string) => `${BASE_URL}exam/overview/${id}`,
    OVERVIEW_HISTORY: (id: string, attemptId: string) =>
      `${BASE_URL}exam/overview/${id}?attempt_id=${attemptId}`,
    CHOOSE_PARTS: (id: string) => `${BASE_URL}exam/${id}/choose-parts`,
  },
  EXAMS: `${BASE_URL}exams`,
  BLOGS: `${BASE_URL}blog`,
  PRACTICE_SMART_LISTENING: {
    BASE: `${BASE_URL}practice-smart-listening`,
    AUDIO: (audioId: string) =>
      `${BASE_URL}practice-smart-listening/${audioId}`,
  },
};

export default ROUTES;
