


// src/components/jee/question-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CreativeStarButton } from "./creative-star-button"; 
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
import { ChevronsUpDown, XCircle, Atom, FlaskConical, Sigma, Wand2 } from "lucide-react"; // Added Wand2
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

interface TopicWithEmoji {
  name: string;
  emoji: string;
}

const allTopics: Record<JEEPaperSubject, TopicWithEmoji[]> = {
  Mathematics: [
    // Class 11
    { name: "Sets", emoji: "📊" },
    { name: "Relations and Functions (Algebra)", emoji: "🔗" },
    { name: "Trigonometric Functions", emoji: "📐" },
    { name: "Principle of Mathematical Induction", emoji: "🪜" },
    { name: "Complex Numbers", emoji: "🌀" },
    { name: "Quadratic Equations", emoji: "📈" },
    { name: "Linear Inequalities", emoji: "📏" },
    { name: "Permutations and Combinations", emoji: "🔢" },
    { name: "Binomial Theorem", emoji: "➕" },
    { name: "Sequences and Series", emoji: "📉" },
    { name: "Straight Lines", emoji: "➖" },
    { name: "Conic Sections", emoji: "⭕" },
    { name: "Introduction to Three Dimensional Geometry", emoji: "🧊" },
    { name: "Limits and Derivatives (Calculus)", emoji: "📈" },
    { name: "Mathematical Reasoning", emoji: "🤔" },
    { name: "Statistics", emoji: "📉" },
    { name: "Probability (Basic)", emoji: "🎲" },
    // Class 12
    { name: "Relations and Functions (Calculus & Advanced)", emoji: "🔗" },
    { name: "Inverse Trigonometric Functions", emoji: "🔄" },
    { name: "Matrices", emoji: "🧮" },
    { name: "Determinants", emoji: "🔢" },
    { name: "Continuity and Differentiability", emoji: "📈" },
    { name: "Application of Derivatives", emoji: "🚗" },
    { name: "Integrals", emoji: "∫" }, // Using actual integral symbol if it renders
    { name: "Application of Integrals", emoji: "💧" },
    { name: "Differential Equations", emoji: "⚙️" },
    { name: "Vector Algebra", emoji: "➡️" },
    { name: "Three Dimensional Geometry (Advanced)", emoji: "🧊" },
    { name: "Linear Programming", emoji: "🎯" },
    { name: "Probability (Advanced)", emoji: "🎲" },
  ],
  Physics: [
    // Class 11
    { name: "Units and Measurements", emoji: "⚖️" },
    { name: "Motion in a Straight Line", emoji: "🚶" },
    { name: "Motion in a Plane", emoji: "✈️" },
    { name: "Laws of Motion", emoji: "🍎" },
    { name: "Work, Energy and Power", emoji: "💪" },
    { name: "System of Particles and Rotational Motion", emoji: "🎡" },
    { name: "Gravitation", emoji: "🌍" },
    { name: "Mechanical Properties of Solids", emoji: "🧱" },
    { name: "Mechanical Properties of Fluids", emoji: "🌊" },
    { name: "Thermal Properties of Matter", emoji: "🔥" },
    { name: "Thermodynamics", emoji: "♨️" },
    { name: "Kinetic Theory", emoji: "💨" },
    { name: "Oscillations", emoji: "〰️" },
    { name: "Waves", emoji: "🔊" },
    // Class 12
    { name: "Electric Charges and Fields", emoji: "⚡" },
    { name: "Electrostatic Potential and Capacitance", emoji: "🔋" },
    { name: "Current Electricity", emoji: "💡" },
    { name: "Moving Charges and Magnetism", emoji: "🧲" },
    { name: "Magnetism and Matter", emoji: "🧭" },
    { name: "Electromagnetic Induction", emoji: "🔌" },
    { name: "Alternating Current", emoji: "〰️" },
    { name: "Electromagnetic Waves", emoji: "📡" },
    { name: "Ray Optics and Optical Instruments", emoji: "👓" },
    { name: "Wave Optics", emoji: "🌈" },
    { name: "Dual Nature of Radiation and Matter", emoji: "✨" },
    { name: "Atoms", emoji: "⚛️" },
    { name: "Nuclei", emoji: "☢️" },
    { name: "Semiconductor Electronics", emoji: "💻" },
    { name: "Communication Systems", emoji: "📱" },
  ],
  Chemistry: [
    // Class 11 Physical
    { name: "Some Basic Concepts of Chemistry", emoji: "🧪" },
    { name: "Structure of Atom", emoji: "🔬" },
    { name: "States of Matter: Gases and Liquids", emoji: "🌡️" },
    { name: "Thermodynamics (Chemical)", emoji: "🔥" },
    { name: "Equilibrium", emoji: "⚖️" },
    // Class 11 Inorganic
    { name: "Classification of Elements and Periodicity", emoji: "🗓️" },
    { name: "Chemical Bonding and Molecular Structure", emoji: "🔗" },
    { name: "Redox Reactions", emoji: "🔄" },
    { name: "Hydrogen", emoji: "💧" }, // Representing H in H2O
    { name: "s-Block Elements", emoji: "🧂" }, // Representing NaCl
    { name: "Some p-Block Elements (Group 13-14)", emoji: "💎" }, // Representing Carbon
    // Class 11 Organic
    { name: "Organic Chemistry: Basic Principles & Techniques", emoji: "🌿" },
    { name: "Hydrocarbons", emoji: "⛽" },
    // Class 12 Physical
    { name: "Solutions", emoji: "🥤" },
    { name: "Electrochemistry", emoji: "🔋" },
    { name: "Chemical Kinetics", emoji: "⏱️" },
    { name: "Surface Chemistry", emoji: "🧼" },
    // Class 12 Inorganic
    { name: "General Principles of Isolation of Elements", emoji: "⛏️" },
    { name: "p-Block Elements (Group 15-18)", emoji: "💨" }, // For noble gases
    { name: "d and f Block Elements", emoji: "⚙️" }, // For transition metals
    { name: "Coordination Compounds", emoji: "🎨" },
    // Class 12 Organic
    { name: "Haloalkanes and Haloarenes", emoji: "👻" }, // Generic for halogens
    { name: "Alcohols, Phenols and Ethers", emoji: "🍷" },
    { name: "Aldehydes, Ketones and Carboxylic Acids", emoji: "🍋" },
    { name: "Organic Compounds Containing Nitrogen (Amines)", emoji: "🧬" },
    { name: "Biomolecules", emoji: "🍞" },
    { name: "Polymers", emoji: "🔗" },
    { name: "Chemistry in Everyday Life", emoji: "🏠" },
    { name: "Environmental Chemistry", emoji: "♻️" },
  ],
};


const formSchema = z.object({
  subject: z.custom<JEEPaperSubject>((val) => ['Physics', 'Chemistry', 'Mathematics'].includes(val as string), {
    message: "Please select a subject.",
  }),
  topics: z.string().min(1, "Please select at least one topic.").max(500, "Topics selection is too long (max 500 characters)."), // Increased max length
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

  const [selectedTopicNames, setSelectedTopicNames] = useState<string[]>(() => {
    const initialTopicsString = defaultValues?.topics || form.getValues('topics');
    return initialTopicsString ? initialTopicsString.split(',').map(t => t.trim()).filter(Boolean) : [];
  });
  const [currentAvailableTopics, setCurrentAvailableTopics] = useState<TopicWithEmoji[]>([]);
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  const selectedSubject = form.watch('subject');

  useEffect(() => {
    if (selectedSubject) {
      setCurrentAvailableTopics(allTopics[selectedSubject] || []);
      // Clear selected topics if subject changes, to avoid mismatched topics
      setSelectedTopicNames([]); 
      form.setValue('topics', '', { shouldValidate: true }); // Clear hidden form field for topics
    } else {
      setCurrentAvailableTopics([]);
      setSelectedTopicNames([]);
      form.setValue('topics', '', { shouldValidate: true });
    }
  }, [selectedSubject, form]);

  useEffect(() => {
    // Update the actual form field for validation whenever selectedTopicNames change
    form.setValue('topics', selectedTopicNames.join(', '), { shouldValidate: true, shouldDirty: true });
  }, [selectedTopicNames, form]);

  const handleTopicToggle = (topicName: string) => {
    setSelectedTopicNames(prev =>
      prev.includes(topicName) ? prev.filter(t => t !== topicName) : [...prev, topicName]
    );
  };

  const subjects: { value: JEEPaperSubject; label: string; icon: React.ElementType }[] = [
    { value: "Physics", label: "Physics", icon: Atom },
    { value: "Chemistry", label: "Chemistry", icon: FlaskConical },
    { value: "Mathematics", label: "Mathematics", icon: Sigma },
  ];

  const difficulties: { value: JEEPaperDifficulty; label: string; emoji: string }[] = [
    { value: "Easy", label: "Easy", emoji: "😊" },
    { value: "Medium", label: "Medium", emoji: "😐" },
    { value: "Hard", label: "Hard", emoji: "🔥" },
  ];

  const handleFormSubmit = (values: QuestionFormValues) => {
    // Ensure the topics value from the internal state is correctly passed
    const finalValues = { ...values, topics: selectedTopicNames.join(', ') };
    onSubmit(finalValues);
  };
  
  const onGenerateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
    form.handleSubmit(handleFormSubmit)(); 
  };


  return (
    <Form {...form}>
      <div className="space-y-8">
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
                        <div className="flex items-center gap-2">
                          <s.icon className="h-4 w-4" />
                          {s.label}
                        </div>
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
                        <div className="flex items-center gap-2">
                          <span role="img" aria-label={d.label} className="text-lg">{d.emoji}</span>
                          {d.label}
                        </div>
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
                    <button 
                      type="button" 
                      role="combobox"
                      aria-expanded={isTopicDropdownOpen}
                      className={cn(
                        "w-full justify-between border border-input bg-background px-3 py-2 h-10 rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center",
                        !selectedSubject && "text-muted-foreground"
                      )}
                      disabled={!selectedSubject || isLoading}
                      onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)} 
                    >
                      {selectedTopicNames.length > 0
                        ? `${selectedTopicNames.length} topic(s) selected`
                        : selectedSubject ? "Select topics..." : "Select a subject first"}
                      <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-popover-trigger-width] p-0">
                    <ScrollArea className="h-72">
                      {currentAvailableTopics.length > 0 ? (
                        currentAvailableTopics.map((topic) => (
                          <DropdownMenuCheckboxItem
                            key={topic.name}
                            checked={selectedTopicNames.includes(topic.name)}
                            onCheckedChange={() => handleTopicToggle(topic.name)}
                          >
                            <span className="mr-2">{topic.emoji}</span>
                            {topic.name}
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
                {selectedTopicNames.map(topicName => {
                  const topicObj = currentAvailableTopics.find(t => t.name === topicName);
                  const emoji = topicObj ? topicObj.emoji : '';
                  return (
                    <Badge key={topicName} variant="secondary" className="whitespace-nowrap">
                      <span className="mr-1.5">{emoji}</span>
                      {topicName}
                      <button
                        type="button"
                        onClick={() => handleTopicToggle(topicName)}
                        className="ml-1.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-1"
                        aria-label={`Remove ${topicName}`}
                      >
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
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
        <div className="flex justify-center">
          <CreativeStarButton
            onClick={onGenerateClick}
            isLoading={isLoading}
            className="w-full md:w-auto" 
          >
            <Wand2 className="jee-wand-icon mr-2 h-5 w-5" />
            <span className="jee-button-text">Generate Paper</span>
          </CreativeStarButton>
        </div>
      </div>
    </Form>
  );
}

