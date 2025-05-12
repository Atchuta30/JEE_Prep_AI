"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
                ${selectedAnswer === question.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
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

            if (showCorrectAnswer) {
              if (index === question.correctAnswer) {
                optionStyle = "border-green-500 ring-2 ring-green-500 bg-green-50";
                indicatorIcon = <CheckCircle className="text-green-600 h-5 w-5" />;
              } else if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) {
                optionStyle = "border-red-500 ring-2 ring-red-500 bg-red-50";
                indicatorIcon = <XCircle className="text-red-600 h-5 w-5" />;
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
          <div className="mt-4 p-4 border-l-4 border-accent bg-accent/10 rounded-r-md">
            <h4 className="font-semibold text-accent-foreground flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-accent" />
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
