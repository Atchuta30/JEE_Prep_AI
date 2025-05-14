
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
  // Initialize isSubmitted based on isReadOnly. If it's a past paper view, it's already "submitted".
  const [isSubmitted, setIsSubmitted] = useState(isReadOnly); 

  useEffect(() => {
    // Update answers and submission state if the paper or isReadOnly status changes
    setAnswers(paper.questions.map(q => q.userSelectedAnswer !== undefined ? q.userSelectedAnswer : null));
    setIsSubmitted(isReadOnly); // Reset submission state based on read-only status
  }, [paper, isReadOnly]);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return; // Prevent changes if already submitted
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true); // Mark as submitted to trigger answer display and disable inputs
    if (onPaperSubmit) {
      onPaperSubmit(answers);
    }
  };

  const calculateScore = () => {
    let calculatedScore = 0;
    let calculatedAnsweredCount = 0;
    let calculatedCorrectCount = 0;

    paper.questions.forEach((question, index) => {
      const currentSelectedAnswer = answers[index]; // Use current answers from state
      if (currentSelectedAnswer !== null && currentSelectedAnswer !== undefined) {
        calculatedAnsweredCount++;
        if (currentSelectedAnswer === question.correctAnswer) {
          calculatedCorrectCount++; // Count as correct for current UI calculation
        }
      }
    });
    
    // Use paper.score if available and showScore is true (typically for history)
    // Otherwise, use the calculatedCorrectCount if the paper has just been submitted.
    const displayScore = (showScore && paper.score !== undefined) ? paper.score : calculatedCorrectCount;

    return {
      score: displayScore, 
      total: paper.questions.length,
      answered: calculatedAnsweredCount,
      correct: calculatedCorrectCount, // This is the live count of correct answers by the user for the current attempt
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
          showCorrectAnswer={isSubmitted} // This controls revealing answers and explanations
          isReadOnly={isReadOnly || isSubmitted} // This disables the radio buttons
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
      
      {/* Display score if the paper is submitted (isSubmitted is true) OR if showScore is true (for history page) */}
      {(isSubmitted || (showScore && paper.score !== undefined)) && paper.questions.length > 0 && (
         <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {/* If isSubmitted is true, show 'correct' which is live calculated. 
                If only showScore is true (history), show 'score' from paper data. */}
            <p className="text-4xl font-bold text-primary">
                {isSubmitted ? correct : score} / {total}
            </p>
            <p className="text-muted-foreground mt-1">
              You answered {answered} questions and got {isSubmitted ? correct : score} correct.
            </p>
            {/* Display recorded score from paper object if viewing history and it exists */}
            {showScore && paper.score !== undefined && !isSubmitted && (
                 <p className="text-xs text-muted-foreground">(Paper recorded score: {paper.score}/{total})</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
