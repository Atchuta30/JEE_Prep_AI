import type { Timestamp } from 'firebase/firestore';

export type JEEQuestion = {
  id?: string; // Optional local ID if needed before saving
  question: string; // LaTeX formatted question
  options: string[]; // LaTeX formatted options
  correctAnswer: number; // Index (0-3) of the correct answer
  explanation?: string; // Optional explanation with LaTeX
  userSelectedAnswer?: number | null; // For UI interaction, null if not answered
  isCorrect?: boolean; // After checking
};

export type JEEPaperDifficulty = 'Easy' | 'Medium' | 'Hard';
export type JEEPaperSubject = 'Physics' | 'Chemistry' | 'Mathematics';

export type JEEPaper = {
  id?: string; // Firestore document ID
  userId?: string | null; // Firebase Auth User ID, null for anonymous
  title?: string; // Optional user-defined title or auto-generated
  subject: JEEPaperSubject;
  topics: string; // Comma-separated
  difficulty: JEEPaperDifficulty;
  numQuestions: number;
  questions: JEEQuestion[];
  createdAt: Date | Timestamp; // Timestamp of creation
  score?: number; // Optional score if paper is attempted
};
