const BASE_URL = "/";

const ROUTES = {
  BASE_URL: BASE_URL,
  FLASHCARDS: {
    CONTEXT_LIST: `${BASE_URL}flashcards/context-list`,
  },
  VOCABULARIES: {
    QUIZLET: `${BASE_URL}vocabularies/quizlet`,
  },
  EXAM_ATTEMPT: {
    BASE: `${BASE_URL}exam`,
    DO: (attempt_id: string) => `${BASE_URL}exam/${attempt_id}`,
  },
  EXAM: {
    OVERVIEW: `${BASE_URL}exam/overview`,
    CHOOSE_PARTS: (id: string) => `${BASE_URL}exam/${id}/choose-parts`,
  },
  EXAMS: `${BASE_URL}exams`,
};

export default ROUTES;
