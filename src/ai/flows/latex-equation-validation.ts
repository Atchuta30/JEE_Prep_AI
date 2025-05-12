// This file contains the Genkit flow for validating LaTeX equations.

'use server';

/**
 * @fileOverview LaTeX equation validation flow.
 *
 * - validateLatexEquation - A function that validates LaTeX equations.
 * - ValidateLatexEquationInput - The input type for the validateLatexEquation function.
 * - ValidateLatexEquationOutput - The return type for the validateLatexEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateLatexEquationInputSchema = z.object({
  latexEquation: z.string().describe('The LaTeX equation to validate.'),
});
export type ValidateLatexEquationInput = z.infer<typeof ValidateLatexEquationInputSchema>;

const ValidateLatexEquationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the LaTeX equation is valid.'),
  errorMessage: z.string().optional().describe('Error message if the equation is invalid.'),
});
export type ValidateLatexEquationOutput = z.infer<typeof ValidateLatexEquationOutputSchema>;

export async function validateLatexEquation(input: ValidateLatexEquationInput): Promise<ValidateLatexEquationOutput> {
  return validateLatexEquationFlow(input);
}

const validateLatexEquationPrompt = ai.definePrompt({
  name: 'validateLatexEquationPrompt',
  input: {schema: ValidateLatexEquationInputSchema},
  output: {schema: ValidateLatexEquationOutputSchema},
  prompt: `You are a LaTeX validator. You will determine if the provided LaTeX equation is valid and renderable. If the equation is valid, return isValid: true. If the equation is invalid, return isValid: false and provide a helpful errorMessage.

LaTeX Equation: {{{latexEquation}}}`,
});

const validateLatexEquationFlow = ai.defineFlow(
  {
    name: 'validateLatexEquationFlow',
    inputSchema: ValidateLatexEquationInputSchema,
    outputSchema: ValidateLatexEquationOutputSchema,
  },
  async input => {
    const {output} = await validateLatexEquationPrompt(input);
    return output!;
  }
);
