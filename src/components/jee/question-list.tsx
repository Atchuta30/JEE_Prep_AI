
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
  isReadOnly?: boolean; // If true, shows answers and disables interaction (viewing from history)
  showScore?: boolean; // If true, displays score if available (primarily for history page)
}

export const QuestionList: FC<QuestionListProps> = ({ paper, onPaperSubmit, isReadOnly = false, showScore = false }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    paper.questions.map(q => q.userSelectedAnswer !== undefined ? q.userSelectedAnswer : null)
  );
  // This state tracks if the user has clicked "Submit Paper" in the current session for the current paper.
  // It's initialized to `isReadOnly` because if we are in read-only mode (history), it's already "submitted".
  const [userHasSubmittedThisSession, setUserHasSubmittedThisSession] = useState(isReadOnly);

  useEffect(() => {
    // When the paper prop changes (e.g., new paper generated or viewing a different history item)
    // or when isReadOnly prop changes (e.g. component is reused for active vs history paper)
    setAnswers(paper.questions.map(q => q.userSelectedAnswer !== undefined ? q.userSelectedAnswer : null));
    // If isReadOnly is true (viewing history), then for display purposes, it's considered submitted.
    // Otherwise, for a new paper being attempted, its submission status is false until the user clicks submit.
    setUserHasSubmittedThisSession(isReadOnly);
  }, [paper, isReadOnly]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    // Prevent changes if viewing from history OR if the user has already submitted this session.
    if (isReadOnly || userHasSubmittedThisSession) return;
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    setUserHasSubmittedThisSession(true); // Mark as submitted for the current session
    if (onPaperSubmit) {
      onPaperSubmit(answers);
    }
  };

  const calculateScoreForDisplay = () => {
    let calculatedAnsweredCount = 0;
    let calculatedCorrectCount = 0;

    paper.questions.forEach((question, index) => {
      const currentSelectedAnswer = answers[index]; // Use current answers from state
      if (currentSelectedAnswer !== null && currentSelectedAnswer !== undefined) {
        calculatedAnsweredCount++;
        if (currentSelectedAnswer === question.correctAnswer) {
          calculatedCorrectCount++;
        }
      }
    });

    return {
      total: paper.questions.length,
      answered: calculatedAnsweredCount,
      correct: calculatedCorrectCount, // Live calculation based on current `answers` state
    };
  };

  const { total, answered, correct: liveCorrectAnswers } = calculateScoreForDisplay();
  const progress = total > 0 ? (answered / total) * 100 : 0;
  
  // Determine which score to display
  const displayFinalScore = (isReadOnly && paper.score !== undefined) ? paper.score : liveCorrectAnswers;

  return (
    <div className="space-y-8">
      {paper.questions.map((question, index) => (
        <QuestionCard
          key={question.id || `q-${index}`}
          question={question}
          questionNumber={index + 1}
          onAnswerSelect={(optionIndex) => handleAnswerSelect(index, optionIndex)}
          selectedAnswer={answers[index]}
          // Show correct answer if viewing history OR if user submitted this session
          showCorrectAnswer={isReadOnly || userHasSubmittedThisSession}
          // Disable interaction if viewing history OR if user submitted this session
          isReadOnly={isReadOnly || userHasSubmittedThisSession}
        />
      ))}

      {/* Progress and Submit button section: Show only if NOT in read-only mode AND user has NOT submitted this session */}
      {!isReadOnly && !userHasSubmittedThisSession && paper.questions.length > 0 && (
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

      {/* Score card section: Show if ( (viewing history OR user submitted this session) OR (showScore prop is true AND paper.score is defined) ) AND there are questions */}
      {((isReadOnly || userHasSubmittedThisSession) || (showScore && paper.score !== undefined)) && paper.questions.length > 0 && (
         <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-primary">
                {displayFinalScore} / {total}
            </p>
            <p className="text-muted-foreground mt-1">
              You answered {answered} questions and got {displayFinalScore} correct.
            </p>
             {/* This is a bit redundant if displayFinalScore already considers paper.score for history, but kept for clarity if showScore is used independently */}
            {showScore && paper.score !== undefined && !userHasSubmittedThisSession && isReadOnly && (
                 <p className="text-xs text-muted-foreground">(Paper recorded score: {paper.score}/{total})</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
