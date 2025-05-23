import type { ReactNode, FC } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { GlowingGridBackground } from './glowing-grid-background';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <GlowingGridBackground />
      <div className="flex flex-col min-h-screen relative z-10">
        <Header />
        <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};
