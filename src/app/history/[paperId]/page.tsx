"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import type { JEEPaper } from '@/lib/types';
import { QuestionList } from '@/components/jee/question-list';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ViewPastPaperPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const paperId = params.paperId as string;

  const [paper, setPaper] = useState<JEEPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !paperId) return;
    if (!user) {
      // User not logged in, redirect or show error
      // router.push('/login'); // Example redirect
      setError("You must be logged in to view this paper.");
      setIsLoading(false);
      return;
    }

    const fetchPaper = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const paperDocRef = doc(db, 'userPapers', paperId);
        const paperDoc = await getDoc(paperDocRef);

        if (paperDoc.exists()) {
          const data = paperDoc.data();
          if (data.userId !== user.uid) {
            setError("You do not have permission to view this paper.");
            setPaper(null);
          } else {
            // Ensure createdAt is a Date object
            const createdAtDate = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt);
            setPaper({ id: paperDoc.id, ...data, createdAt: createdAtDate } as JEEPaper);
          }
        } else {
          setError("Paper not found.");
          setPaper(null);
        }
      } catch (err: any) {
        console.error("Error fetching paper:", err);
        setError(err.message || "Failed to load paper details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaper();
  }, [user, authLoading, paperId, router]);

  if (authLoading || isLoading) {
    return (
       <div className="space-y-6">
        <Skeleton className="h-10 w-40" /> {/* Back button */}
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
            <Skeleton className="h-4 w-1/3 mt-1" />
          </CardHeader>
        </Card>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center space-x-3 p-3 border rounded-md">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Error Loading Paper</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button variant="outline" asChild className="mt-6">
          <Link href="/history"><ArrowLeft className="mr-2 h-4 w-4"/> Back to History</Link>
        </Button>
      </div>
    );
  }

  if (!paper) {
     return (
      <div className="text-center py-10">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Paper Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested paper could not be found or you don't have access.</p>
         <Button variant="outline" asChild className="mt-6">
          <Link href="/history"><ArrowLeft className="mr-2 h-4 w-4"/> Back to History</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/history"><ArrowLeft className="mr-2 h-4 w-4"/> Back to History</Link>
      </Button>
      
      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-2xl md:text-3xl">
            {paper.title || `${paper.subject} Paper - ${paper.difficulty}`}
          </CardTitle>
          <CardDescription className="text-base">
            Generated on: {format(new Date(paper.createdAt), "PPPPpp")}
          </CardDescription>
          <div className="mt-2 text-sm text-muted-foreground">
            <p><strong>Topics:</strong> {paper.topics}</p>
            <p><strong>Questions:</strong> {paper.numQuestions}</p>
            {paper.score !== undefined && <p><strong>Score:</strong> {paper.score}/{paper.numQuestions}</p>}
          </div>
        </CardHeader>
      </Card>

      <QuestionList paper={paper} isReadOnly={true} showScore={true} />
    </div>
  );
}

