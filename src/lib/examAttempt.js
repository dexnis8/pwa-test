const ACTIVE_EXAM_KEY = "pace.activeExamAttempt";
const EXAM_RESULT_KEY = "pace.examResult";
export const EXAM_DURATION_SECONDS = 2 * 60 * 60;

const readSessionValue = (key) => {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const writeSessionValue = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

const removeSessionValue = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Storage can be unavailable in private browsing or restrictive browser modes.
  }
};

export const createExamAttempt = ({ examData, subjects }) => {
  const startedAt = Date.now();

  return {
    examData,
    subjects,
    answers: Object.fromEntries(subjects.map((subject) => [subject, []])),
    skipped: {},
    currentSubject: subjects[0] || "english",
    currentQuestionIndex: 0,
    startedAt,
    endsAt: startedAt + EXAM_DURATION_SECONDS * 1000,
  };
};

export const getActiveExamAttempt = () => readSessionValue(ACTIVE_EXAM_KEY);
export const saveActiveExamAttempt = (attempt) =>
  writeSessionValue(ACTIVE_EXAM_KEY, attempt);
export const clearActiveExamAttempt = () => removeSessionValue(ACTIVE_EXAM_KEY);

export const getExamResult = () => readSessionValue(EXAM_RESULT_KEY);
export const saveExamResult = (result) => writeSessionValue(EXAM_RESULT_KEY, result);
export const clearExamResult = () => removeSessionValue(EXAM_RESULT_KEY);

export const getRemainingExamSeconds = (endsAt) =>
  Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
