
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MathJaxRenderer from "./mathjax-renderer";
import type { JEEQuestion } from "@/lib/types";
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: JEEQuestion;
  questionNumber: number;
  onAnswerSelect?: (optionIndex: number) => void;
  selectedAnswer?: number | null; // This is the user's selection for this question
  showCorrectAnswer?: boolean; // To highlight correct/incorrect answers (true after submission or for history)
  isReadOnly?: boolean; // If true, disables radio buttons (true for history or after submission)
}

export const QuestionCard: FC<QuestionCardProps> = ({
  question,
  questionNumber,
  onAnswerSelect,
  selectedAnswer, 
  showCorrectAnswer = false,
  isReadOnly = false,
}) => {
  const handleValueChange = (value: string) => {
    if (onAnswerSelect && !isReadOnly) {
      onAnswerSelect(parseInt(value));
    }
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index); // A, B, C, D

  return (
    <Card className="mb-6 shadow-lg overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg flex justify-between items-start">
          <span>Question {questionNumber}</span>
          {showCorrectAnswer && selectedAnswer !== undefined && selectedAnswer !== null && (
            <span
              className={cn(
                `px-3 py-1 rounded-full text-xs font-semibold`,
                selectedAnswer === question.correctAnswer
                  ? 'bg-green-500 text-white dark:bg-green-600 dark:text-green-50'
                  : 'bg-red-500 text-white dark:bg-red-600 dark:text-red-50'
              )}
            >
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="inline-block mr-1 h-4 w-4" />
              ) : (
                <XCircle className="inline-block mr-1 h-4 w-4" />
              )}
              {selectedAnswer === question.correctAnswer ? 'Correct' : 'Incorrect'}
            </span>
          )}
        </CardTitle>
        <CardDescription className="pt-2">
          <MathJaxRenderer latex={question.question} />
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup
          onValueChange={handleValueChange}
          value={selectedAnswer !== undefined && selectedAnswer !== null ? String(selectedAnswer) : undefined}
          disabled={isReadOnly}
        >
          {question.options.map((option, index) => {
            const optionId = `q${questionNumber}-option${index}`;
            let optionStyle = "border-border";
            let indicatorIcon = null;

            if (showCorrectAnswer) { 
              const isThisOptionTheActualCorrectAnswer = index === question.correctAnswer;
              const isThisOptionSelectedByTheUser = index === selectedAnswer;

              if (isThisOptionTheActualCorrectAnswer) {
                optionStyle = "border-green-500 ring-2 ring-green-500 bg-green-50 dark:bg-green-700/20";
                indicatorIcon = <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
              } else if (isThisOptionSelectedByTheUser && !isThisOptionTheActualCorrectAnswer) {
                optionStyle = "border-red-500 ring-2 ring-red-500 bg-red-50 dark:bg-red-700/20";
                indicatorIcon = <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
              } else {
                optionStyle = "opacity-60 border-border";
              }
            } else if (selectedAnswer === index) {
              optionStyle = "ring-2 ring-primary border-primary";
            }

            return (
              <Label
                key={index}
                htmlFor={optionId}
                className={cn(
                  `flex items-start space-x-3 p-4 border rounded-md transition-all`,
                  optionStyle,
                  isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-muted/80'
                )}
              >
                <RadioGroupItem
                  value={String(index)}
                  id={optionId}
                  className="mt-1"
                  disabled={isReadOnly}
                />
                <div className="flex-1">
                  <span className="font-semibold mr-2">{getOptionLabel(index)}.</span>
                  <MathJaxRenderer latex={option} className="inline-block"/>
                </div>
                {indicatorIcon && <div className="ml-auto self-center">{indicatorIcon}</div>}
              </Label>
            );
          })}
        </RadioGroup>
        {showCorrectAnswer && (
          <div className="mt-6 p-4 border-l-4 border-primary bg-secondary/50 rounded-r-md">
            <h4 className="font-semibold text-foreground flex items-center mb-2">
              <HelpCircle className="h-5 w-5 mr-2 text-primary" />
              {question.explanation ? "Explanation" : "Correct Answer Details"}
            </h4>
            <div className="text-sm text-foreground/80 space-y-1">
              <div> {/* Changed p to div here */}
                The correct answer is <strong>Option {getOptionLabel(question.correctAnswer)}</strong>:
                <MathJaxRenderer latex={question.options[question.correctAnswer]} className="inline-block ml-1"/>
              </div>
              {question.explanation && (
                <div className="mt-2 pt-2 border-t border-border/50">
                   <p className="font-medium mb-1">Explanation:</p>
                   <MathJaxRenderer latex={question.explanation} />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

