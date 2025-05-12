"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MathJaxRenderer from "./mathjax-renderer";
import type { JEEQuestion } from "@/lib/types";
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: JEEQuestion;
  questionNumber: number;
  onAnswerSelect?: (optionIndex: number) => void;
  selectedAnswer?: number | null;
  showCorrectAnswer?: boolean; // To highlight correct/incorrect answers
  isReadOnly?: boolean; // If true, disables radio buttons
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
    if (onAnswerSelect) {
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
              className={`px-3 py-1 rounded-full text-xs font-semibold
                ${selectedAnswer === question.correctAnswer 
                  ? 'bg-foreground text-background' 
                  : 'bg-muted text-foreground border border-foreground'}`}
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
          disabled={isReadOnly || showCorrectAnswer} // Disable if read-only or if answers are revealed
        >
          {question.options.map((option, index) => {
            const optionId = `q${questionNumber}-option${index}`;
            let optionStyle = "border-border"; // Default border
            let indicatorIcon = null;
            const indicatorColorClass = "text-foreground";

            if (showCorrectAnswer) {
              if (index === question.correctAnswer) {
                optionStyle = "border-foreground ring-2 ring-foreground bg-secondary";
                indicatorIcon = <CheckCircle className={`h-5 w-5 ${indicatorColorClass}`} />;
              } else if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                optionStyle = "border-foreground border-dashed ring-1 ring-foreground bg-background opacity-80";
                indicatorIcon = <XCircle className={`h-5 w-5 ${indicatorColorClass}`} />;
              } else {
                // Other non-selected options when answers are shown and not the correct one
                optionStyle = "opacity-60";
              }
            }

            return (
              <Label
                key={index}
                htmlFor={optionId}
                className={`flex items-start space-x-3 p-4 border rounded-md cursor-pointer transition-all hover:bg-muted/80 ${optionStyle} 
                  ${(isReadOnly || showCorrectAnswer) ? 'cursor-default' : ''}
                  ${selectedAnswer === index && !showCorrectAnswer ? 'ring-2 ring-primary border-primary' : ''}`}
              >
                <RadioGroupItem value={String(index)} id={optionId} className="mt-1" />
                <div className="flex-1">
                  <span className="font-semibold mr-2">{getOptionLabel(index)}.</span>
                  <MathJaxRenderer latex={option} className="inline-block"/>
                </div>
                {indicatorIcon && <div className="ml-auto self-center">{indicatorIcon}</div>}
              </Label>
            );
          })}
        </RadioGroup>
        {showCorrectAnswer && question.explanation && (
          <div className="mt-4 p-4 border-l-4 border-primary bg-secondary/50 rounded-r-md">
            <h4 className="font-semibold text-foreground flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-primary" />
              Explanation
            </h4>
            <div className="mt-2 text-sm text-foreground/80">
              <MathJaxRenderer latex={question.explanation} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
