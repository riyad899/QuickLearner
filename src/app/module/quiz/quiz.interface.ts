export interface ICreateQuizPayload {
  title: string;
  courseId: number;
  moduleID: number;
}

export interface IUpdateQuizPayload {
  title?: string;
  courseId?: number;
  moduleID?: number;
}

export interface ICreateQuestionPayload {
  text: string;
  quizId: string;
  correctId: string;
}

export interface ICreateOptionPayload {
  id?: string;
  text: string;
  questionId: string;
}

export interface ICreateQuizSubmissionPayload {
  quizId: string;
  studentId: string;
  score: number;
}

export interface ICreateAnswerPayload {
  questionId: string;
  selectedOptionId: string;
  submissionId: string;
}
