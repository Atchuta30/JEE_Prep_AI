"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { QuestionCard } from './question-card';
import type { JEEQuestion, JEEPaper } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface QuestionListProps {
  paper: JEEPaper;
  onPaperSubmit?: (answers: (number | null)[]) => void; // Callback when paper is submitted
  isReadOnly?: boolean; // If true, shows answers and disables interaction
  showScore?: boolean; // If true, displays score if available
}

export const QuestionList: FC<QuestionListProps> = ({ paper, onPaperSubmit, isReadOnly = false, showScore = false }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(() => 
    paper.questions.map(q => q.userSelectedAnswer !== undefined ? q.userSelectedAnswer : null)
  );
  const [isSubmitted, setIsSubmitted] = useState(isReadOnly); // If read-only, assume it's submitted/post-submission view

  useEffect(() => {
    // If paper.questions have pre-filled answers (e.g. loading a saved attempt)
    setAnswers(paper.questions.map(q => q.userSelectedAnswer !== undefined ? q.userSelectedAnswer : null));
    setIsSubmitted(isReadOnly);
  }, [paper, isReadOnly]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (onPaperSubmit) {
      onPaperSubmit(answers);
    }
  };

  const calculateScore = () => {
    let calculatedScore = 0;
    let calculatedAnsweredCount = 0;
    let calculatedCorrectCount = 0;

    paper.questions.forEach((question, index) => {
      if (answers[index] !== null) { // Check current answers state
        calculatedAnsweredCount++;
        // Score and correct count are only determined if the paper is submitted
        if (isSubmitted && answers[index] === question.correctAnswer) {
          calculatedScore++;
          calculatedCorrectCount++;
        }
      }
    });

    return {
      // Score is the number of correct answers if submitted, otherwise 0.
      score: calculatedScore, 
      total: paper.questions.length,
      // Answered count is always based on current selections.
      answered: calculatedAnsweredCount,
      // Correct count is the number of correct answers if submitted, otherwise 0.
      correct: calculatedCorrectCount, 
    };
  };

  const { score, total, answered, correct } = calculateScore();
  const progress = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="space-y-8">
      {paper.questions.map((question, index) => (
        <QuestionCard
          key={question.id || `q-${index}`}
          question={question}
          questionNumber={index + 1}
          onAnswerSelect={(optionIndex) => handleAnswerSelect(index, optionIndex)}
          selectedAnswer={answers[index]}
          showCorrectAnswer={isSubmitted}
          isReadOnly={isReadOnly || isSubmitted}
        />
      ))}

      {!isReadOnly && !isSubmitted && paper.questions.length > 0 && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Test Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
              <span>{answered} / {total} Answered</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={answered !== total} // Enable only if all questions are answered
                >
                  Submit Paper
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You cannot change your answers after submitting. Make sure you have answered all questions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}
      
      {(isSubmitted || showScore) && paper.questions.length > 0 && (
         <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-primary">{correct} / {total}</p>
            <p className="text-muted-foreground mt-1">
              You answered {answered} questions and got {correct} correct.
            </p>
            {paper.score !== undefined && paper.score !== null && showScore && <p className="text-xs text-muted-foreground">(Paper recorded score: {paper.score}/{total})</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
