// src/app/page.tsx
"use client";

import { useState } from 'react';
import { QuestionForm, type QuestionFormValues } from "@/components/jee/question-form";
import { QuestionList } from "@/components/jee/question-list";
import type { JEEPaper, JEEQuestion } from '@/lib/types';
import { generateJEEQuestions } from '@/ai/flows/generate-jee-questions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Lightbulb, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { savePaperToHistory } from './actions'; // Server action

export default function HomePage() {
  const [generatedPaper, setGeneratedPaper] = useState<JEEPaper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (values: QuestionFormValues) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPaper(null);

    try {
      const aiInput = {
        subject: values.subject,
        topics: values.topics,
        difficulty: values.difficulty,
        numQuestions: values.numQuestions,
      };
      const result = await generateJEEQuestions(aiInput);
      
      if (result.questions && result.questions.length > 0) {
        const paper: JEEPaper = {
          subject: values.subject,
          topics: values.topics,
          difficulty: values.difficulty,
          numQuestions: values.numQuestions,
          questions: result.questions.map((q, index) => ({
            ...q,
            id: `q-${Date.now()}-${index}`, // Basic unique ID for client-side key
            userSelectedAnswer: null, // Initialize for interaction
          })),
          createdAt: new Date(),
          userId: user?.uid || null,
        };
        setGeneratedPaper(paper);
        toast({
          title: "Paper Generated!",
          description: `${paper.numQuestions} questions ready for you.`,
          variant: "default"
        });
      } else {
        setError("The AI couldn't generate questions with the provided input. Please try different topics or settings.");
        toast({
          title: "Generation Failed",
          description: "No questions were generated. Try adjusting your input.",
          variant: "destructive",
        });
      }
    } catch (e: any) {
      console.error("Error generating questions:", e);
      setError(e.message || "An unexpected error occurred while generating questions.");
      toast({
        title: "Error",
        description: e.message || "Failed to generate questions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaperSubmit = async (answers: (number | null)[]) => {
    if (!generatedPaper) return;

    let score = 0;
    const updatedQuestions = generatedPaper.questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      if (isCorrect && answers[index] !== null) score++;
      return { ...q, userSelectedAnswer: answers[index], isCorrect };
    });
    
    const submittedPaper: JEEPaper = {
      ...generatedPaper,
      questions: updatedQuestions,
      score: score,
    };
    setGeneratedPaper(submittedPaper); // Update UI to show correct/incorrect

    toast({
      title: "Paper Submitted!",
      description: `Your score is ${score}/${submittedPaper.numQuestions}.`,
    });

    if (user) {
      try {
        // Convert Date to string or Firebase Timestamp for Firestore
        const paperToSave = {
          ...submittedPaper,
          createdAt: submittedPaper.createdAt.toISOString(), // Or convert to Firestore Timestamp in server action
          userId: user.uid, // Ensure userId is set
        };
        // Type casting for server action, or adjust server action input type
        const savedId = await savePaperToHistory(paperToSave as any); 
        toast({
          title: "Saved to History",
          description: `Your attempt has been saved with ID: ${savedId}`,
        });
      } catch (err) {
        console.error("Failed to save paper:", err);
        toast({
          title: "Save Failed",
          description: "Could not save your paper to history.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Anonymous Submission",
        description: "Log in to save your attempts to history.",
        variant: "default",
      });
    }
  };


  return (
    <div className="space-y-12">
      <Card className="shadow-xl overflow-hidden bg-card/5 backdrop-blur-md border">
        <CardHeader className="bg-gradient-to-r from-primary/80 to-primary/70 text-primary-foreground p-8">
          <div className="flex items-center gap-4">
            <Lightbulb size={48} />
            <div>
              <CardTitle className="text-3xl font-bold">Generate Your JEE Mock Paper</CardTitle>
              <CardDescription className="text-primary-foreground/90 mt-1 text-lg">
                Tailor questions to your study needs. Select subject, topics, difficulty, and number of questions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <QuestionForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-4 mt-8">
          <Skeleton className="h-12 w-1/3" />
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="shadow-lg bg-card/20 backdrop-blur-md border">
              <CardHeader>
                <Skeleton className="h-6 w-1/4 mb-2 bg-muted/50" />
                <Skeleton className="h-4 w-full bg-muted/50" />
                <Skeleton className="h-4 w-3/4 bg-muted/50" />
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-3 p-3 border rounded-md bg-background/50 backdrop-blur-sm">
                    <Skeleton className="h-5 w-5 rounded-full bg-muted/50" />
                    <Skeleton className="h-4 flex-1 bg-muted/50" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-8 bg-destructive/80 backdrop-blur-md text-destructive-foreground border-destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Generating Questions</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedPaper && !isLoading && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <ListChecks size={32} className="text-accent" />
            <h2 className="text-3xl font-semibold">Your Custom Paper</h2>
          </div>
          {/* QuestionList contains cards that could also be made glassy if desired */}
          <QuestionList paper={generatedPaper} onPaperSubmit={handlePaperSubmit} />
        </div>
      )}

      {!isLoading && !generatedPaper && !error && (
        <Card className="mt-12 text-center py-12 bg-muted/20 backdrop-blur-sm border-dashed border-border/50">
          <CardContent>
             <svg
                className="mx-auto h-16 w-16 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                data-ai-hint="empty state document"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            <h3 className="mt-4 text-xl font-semibold text-foreground">No paper generated yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form above to create your personalized JEE mock paper.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

