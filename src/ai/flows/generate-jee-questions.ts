// src/ai/flows/generate-jee-questions.ts
'use server';

/**
 * @fileOverview Generates JEE Main-style multiple-choice questions based on subject, topics, and difficulty.
 *
 * - generateJEEQuestions - A function that handles the question generation process.
 * - GenerateJEEQuestionsInput - The input type for the generateJEEQuestions function.
 * - GenerateJEEQuestionsOutput - The return type for the generateJEEQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJEEQuestionsInputSchema = z.object({
  subject: z.string().describe('The subject of the questions (e.g., Physics, Chemistry, Math).'),
  topics: z.string().describe('Comma-separated list of topics to include in the questions.'),
  difficulty: z
    .enum(['Easy', 'Medium', 'Hard'])
    .describe('The difficulty level of the questions.'),
  numQuestions: z.number().int().min(1).max(20).default(10).describe('The number of questions to generate (up to 20).'),
});
export type GenerateJEEQuestionsInput = z.infer<typeof GenerateJEEQuestionsInputSchema>;

const JEEQuestionSchema = z.object({
  question: z.string().describe('The question text, including LaTeX formatting for equations.'),
  options: z.array(z.string()).describe('An array of multiple-choice options, with LaTeX formatting.'),
  correctAnswer: z.number().int().min(0).max(3).describe('The index (0-3) of the correct answer in the options array.'),
});

const GenerateJEEQuestionsOutputSchema = z.object({
  questions: z.array(JEEQuestionSchema).describe('An array of JEE Main-style multiple-choice questions.'),
});
export type GenerateJEEQuestionsOutput = z.infer<typeof GenerateJEEQuestionsOutputSchema>;

export async function generateJEEQuestions(input: GenerateJEEQuestionsInput): Promise<GenerateJEEQuestionsOutput> {
  return generateJEEQuestionsFlow(input);
}

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: {schema: GenerateJEEQuestionsInputSchema},
  output: {schema: GenerateJEEQuestionsOutputSchema},
  prompt: `You are an expert in creating JEE Main-style multiple-choice questions.

  Generate {{numQuestions}} questions for the subject: {{{subject}}}, covering the topics: {{{topics}}}.
  The difficulty level should be: {{{difficulty}}}.

  Each question should include LaTeX formatting for math equations where necessary. Make sure the equations render well in a display format.

  The output should be a JSON object with a 'questions' array. Each element in the array should have the structure:
  {
  "question": "The question text with LaTeX formatting.",
  "options": ["Option A with LaTeX", "Option B with LaTeX", "Option C with LaTeX", "Option D with LaTeX"],
  "correctAnswer": 0 // Index of the correct answer (0-3)
  }
  `,
});

const generateJEEQuestionsFlow = ai.defineFlow(
  {
    name: 'generateJEEQuestionsFlow',
    inputSchema: GenerateJEEQuestionsInputSchema,
    outputSchema: GenerateJEEQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateQuestionsPrompt(input);
    return output!;
  }
);
