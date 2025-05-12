"use client";
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, User, CalendarDays } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6" /> <Skeleton className="h-5 w-full" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6" /> <Skeleton className="h-5 w-full" />
            </div>
             <Skeleton className="h-10 w-full mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const userInitials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email ? user.email[0].toUpperCase() : "?";

  const creationDate = user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A';

  const handleSignOut = async () => {
    await signOutUser();
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
            <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email || user.uid}.png`} alt={user.displayName || "User"} />
            <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.displayName || 'User Profile'}</CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-3 bg-muted/50 rounded-md">
            <User className="h-5 w-5 mr-3 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Full Name</p>
              <p className="text-sm text-muted-foreground">{user.displayName || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-muted/50 rounded-md">
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
             <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-muted/50 rounded-md">
            <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
             <div>
              <p className="text-sm font-medium text-foreground">Joined On</p>
              <p className="text-sm text-muted-foreground">{creationDate}</p>
            </div>
          </div>
          
          {/* Placeholder for more profile actions, e.g., update password */}
          {/* <Button variant="outline" className="w-full mt-2">Update Profile</Button> */}
          
          <Button variant="destructive" onClick={handleSignOut} className="w-full mt-6">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
