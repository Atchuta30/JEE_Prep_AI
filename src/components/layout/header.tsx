import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/user-nav';
import { Atom, Sigma, FlaskConical } from 'lucide-react'; // Example icons

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Using an SVG for a more unique logo if needed, or text */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-6h4v-2h-4v2zm0-4h4V8h-4v2z"/>
          </svg>
          <h1 className="text-2xl font-bold text-foreground">
            JEE Question Master
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          {/* Placeholder for subject icons or other nav items */}
          {/* <Atom className="text-muted-foreground hover:text-foreground transition-colors" />
          <FlaskConical className="text-muted-foreground hover:text-foreground transition-colors" />
          <Sigma className="text-muted-foreground hover:text-foreground transition-colors" /> */}
          <UserNav />
        </nav>
      </div>
    </header>
  );
};
