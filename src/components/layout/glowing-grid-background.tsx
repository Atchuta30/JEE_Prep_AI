"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export const GlowingGridBackground = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        gridRef.current.style.setProperty('--mouse-x', `${x}px`);
        gridRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={gridRef} className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
      <div
        className={cn(
          "glow-overlay", // Class for CSS targeting the radial glow
          "absolute inset-0 opacity-0 transition-opacity duration-300", // Controls visibility of radial glow
          // The glow is now fully opaque (via --glow-color CSS var) and located behind the grid lines.
          "bg-[radial-gradient(circle_10px_at_var(--mouse-x)_var(--mouse-y),var(--glow-color)_0%,var(--glow-color)_50%,transparent_100%)]"
        )}
      />
      <div
        className={cn(
          "grid-lines-element", // Class for CSS targeting of grid lines
          "absolute inset-0", 
          "bg-[size:2rem_2rem]" // Grid cell size, background-image handled by CSS
        )}
      />
    </div>
  );
};
