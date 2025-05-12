"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { JEEPaperDifficulty, JEEPaperSubject } from "@/lib/types";
import { Wand2 } from "lucide-react";

const formSchema = z.object({
  subject: z.custom<JEEPaperSubject>((val) => ['Physics', 'Chemistry', 'Mathematics'].includes(val as string), {
    message: "Please select a subject.",
  }),
  topics: z.string().min(3, "Please enter at least one topic (min 3 characters).").max(200, "Topics are too long (max 200 characters)."),
  difficulty: z.custom<JEEPaperDifficulty>((val) => ['Easy', 'Medium', 'Hard'].includes(val as string), {
    message: "Please select a difficulty level.",
  }),
  numQuestions: z.coerce.number().min(1, "Minimum 1 question.").max(20, "Maximum 20 questions."),
});

export type QuestionFormValues = z.infer<typeof formSchema>;

interface QuestionFormProps {
  onSubmit: (values: QuestionFormValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<QuestionFormValues>;
}

export function QuestionForm({ onSubmit, isLoading = false, defaultValues }: QuestionFormProps) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: defaultValues?.subject || undefined,
      topics: defaultValues?.topics || "",
      difficulty: defaultValues?.difficulty || undefined,
      numQuestions: defaultValues?.numQuestions || 10,
    },
  });

  const subjects: { value: JEEPaperSubject; label: string; icon?: React.ElementType }[] = [
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
    { value: "Mathematics", label: "Mathematics" },
  ];

  const difficulties: { value: JEEPaperDifficulty; label: string }[] = [
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficulties.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Kinematics, Thermodynamics, Calculus, Organic Chemistry Basics"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter comma-separated topics.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="numQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </div>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" /> Generate Paper
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
