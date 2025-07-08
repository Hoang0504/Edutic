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
    DO: (id: string) => `${BASE_URL}exam-attempt/${id}`,
    RESULT: (id: string) => `${BASE_URL}exam-attempt/${id}/results`,
  },
  EXAM: {
    OVERVIEW: `${BASE_URL}exam/overview`,
    CHOOSE_PARTS: (id: string) => `${BASE_URL}exam/${id}/choose-parts`,
  },
  EXAMS: `${BASE_URL}exams`,
};

export default ROUTES;
