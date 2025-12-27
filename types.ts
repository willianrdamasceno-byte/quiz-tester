
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizConfig {
  topic: string;
  difficulty: 'básica' | 'intermediária' | 'avançada';
  count: number;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: string;
    selected: string;
    isCorrect: boolean;
  }[];
  aiComment?: string;
}
