export * from './roles';

export const DQM_CONFIG = {
  MIN_GRADE: 0.0,
  MAX_GRADE: 4.0,
  PASSING_GRADE: 2.0,
  STUDENT_ID_REGEX: /^STU-\d{4}-\d{4}$/,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};
