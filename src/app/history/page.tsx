"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import type { JEEPaper } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, BookOpen, ListOrdered } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [papers, setPapers] = useState<JEEPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      // Optionally redirect or show message to login
      return;
    }

    const fetchPapers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const papersRef = collection(db, 'userPapers');
        const q = query(papersRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedPapers: JEEPaper[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Ensure createdAt is a Date object
          const createdAtDate = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt);
          fetchedPapers.push({ id: doc.id, ...data, createdAt: createdAtDate } as JEEPaper);
        });
        setPapers(fetchedPapers);
      } catch (err: any) {
        console.error("Error fetching papers:", err);
        setError(err.message || "Failed to load paper history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPapers();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><ListOrdered /> Paper History</h1>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
         <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">Please log in to view your paper history.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-destructive text-center py-10">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2"><ListOrdered /> Paper History</h1>
        <Button variant="outline" asChild><Link href="/">Generate New Paper</Link></Button>
      </div>

      {papers.length === 0 ? (
        <Card className="text-center py-12 bg-muted/30 border-dashed">
           <CardContent>
             <svg
                className="mx-auto h-16 w-16 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                data-ai-hint="empty state folder"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            <h3 className="mt-4 text-xl font-semibold text-foreground">No papers in history</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate some papers and they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {papers.map(paper => (
            <Card key={paper.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">
                  {paper.title || `${paper.subject} - ${paper.difficulty}`}
                </CardTitle>
                <CardDescription>
                  {paper.numQuestions} questions. Score: {paper.score ?? 'N/A'} / {paper.numQuestions}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Topics: <span className="font-medium text-foreground truncate block max-w-full">{paper.topics}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generated: {format(new Date(paper.createdAt), "PPpp")}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={`/history/${paper.id}`}>
                    <BookOpen className="mr-2 h-4 w-4"/> View Paper
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
