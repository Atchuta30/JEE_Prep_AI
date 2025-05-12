// src/components/jee/question-form.tsx
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
import type { JEEPaperDifficulty, JEEPaperSubject } from "@/lib/types";
import { Wand2, ChevronsUpDown, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const allTopics: Record<JEEPaperSubject, string[]> = {
  Mathematics: [
    // Class 11
    "Sets", "Relations and Functions (Algebra)", "Trigonometric Functions", 
    "Principle of Mathematical Induction", "Complex Numbers", "Quadratic Equations", 
    "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", 
    "Sequences and Series", "Straight Lines", "Conic Sections", 
    "Introduction to Three Dimensional Geometry", "Limits and Derivatives (Calculus)", 
    "Mathematical Reasoning", "Statistics", "Probability (Basic)",
    // Class 12
    "Relations and Functions (Calculus & Advanced)", "Inverse Trigonometric Functions", 
    "Matrices", "Determinants", "Continuity and Differentiability", 
    "Application of Derivatives", "Integrals", "Application of Integrals", 
    "Differential Equations", "Vector Algebra", "Three Dimensional Geometry (Advanced)", 
    "Linear Programming", "Probability (Advanced)"
  ],
  Physics: [
    // Class 11
    "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", 
    "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion", 
    "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", 
    "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", 
    "Oscillations", "Waves",
    // Class 12
    "Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", 
    "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", 
    "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", 
    "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", 
    "Semiconductor Electronics", "Communication Systems"
  ],
  Chemistry: [
    // Class 11 Physical
    "Some Basic Concepts of Chemistry", "Structure of Atom", "States of Matter: Gases and Liquids",
    "Thermodynamics (Chemical)", "Equilibrium",
    // Class 11 Inorganic
    "Classification of Elements and Periodicity", "Chemical Bonding and Molecular Structure",
    "Redox Reactions", "Hydrogen", "s-Block Elements", "Some p-Block Elements (Group 13-14)",
    // Class 11 Organic
    "Organic Chemistry: Basic Principles & Techniques", "Hydrocarbons",
    // Class 12 Physical
    "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry",
    // Class 12 Inorganic
    "General Principles of Isolation of Elements", "p-Block Elements (Group 15-18)", 
    "d and f Block Elements", "Coordination Compounds",
    // Class 12 Organic
    "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", 
    "Aldehydes, Ketones and Carboxylic Acids", "Organic Compounds Containing Nitrogen (Amines)",
    "Biomolecules", "Polymers", "Chemistry in Everyday Life",
    "Environmental Chemistry"
  ],
};


const formSchema = z.object({
  subject: z.custom<JEEPaperSubject>((val) => ['Physics', 'Chemistry', 'Mathematics'].includes(val as string), {
    message: "Please select a subject.",
  }),
  topics: z.string().min(1, "Please select at least one topic.").max(300, "Topics selection is too long (max 300 characters)."),
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

  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    const initialTopicsString = defaultValues?.topics || form.getValues('topics');
    return initialTopicsString ? initialTopicsString.split(',').map(t => t.trim()).filter(Boolean) : [];
  });
  const [currentAvailableTopics, setCurrentAvailableTopics] = useState<string[]>([]);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  const selectedSubject = form.watch('subject');

  useEffect(() => {
    if (selectedSubject) {
      setCurrentAvailableTopics(allTopics[selectedSubject] || []);
      // Clear selected topics if subject changes, to avoid mismatched topics
      setSelectedTopics([]); 
      form.setValue('topics', '', { shouldValidate: true }); // Clear hidden form field for topics
    } else {
      setCurrentAvailableTopics([]);
      setSelectedTopics([]);
      form.setValue('topics', '', { shouldValidate: true });
    }
  }, [selectedSubject, form]);

  useEffect(() => {
    // Update the actual form field for validation whenever selectedTopics change
    form.setValue('topics', selectedTopics.join(', '), { shouldValidate: true, shouldDirty: true });
  }, [selectedTopics, form]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

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

  const handleFormSubmit = (values: QuestionFormValues) => {
    // Ensure the topics value from the internal state is correctly passed
    const finalValues = { ...values, topics: selectedTopics.join(', ') };
    onSubmit(finalValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
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
          render={({ fieldState }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <DropdownMenu open={isTopicDropdownOpen} onOpenChange={setIsTopicDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isTopicDropdownOpen}
                      className={cn(
                        "w-full justify-between",
                        !selectedSubject && "text-muted-foreground"
                      )}
                      disabled={!selectedSubject || isLoading}
                    >
                      {selectedTopics.length > 0
                        ? `${selectedTopics.length} topic(s) selected`
                        : selectedSubject ? "Select topics..." : "Select a subject first"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-popover-trigger-width] p-0">
                    <ScrollArea className="h-72">
                      {currentAvailableTopics.length > 0 ? (
                        currentAvailableTopics.map((topic) => (
                          <DropdownMenuCheckboxItem
                            key={topic}
                            checked={selectedTopics.includes(topic)}
                            onCheckedChange={() => handleTopicToggle(topic)}
                            // onSelect={(e) => e.preventDefault()} // Keep dropdown open
                          >
                            {topic}
                          </DropdownMenuCheckboxItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>
                          {selectedSubject ? "No topics available for this subject." : "Please select a subject first."}
                        </DropdownMenuItem>
                      )}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <div className="pt-2 flex flex-wrap gap-1">
                {selectedTopics.map(topic => (
                  <Badge key={topic} variant="secondary" className="whitespace-nowrap">
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className="ml-1.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      aria-label={`Remove ${topic}`}
                    >
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Select relevant topics for the paper.
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
