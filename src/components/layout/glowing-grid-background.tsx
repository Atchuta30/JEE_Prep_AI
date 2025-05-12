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
          "absolute inset-0 transition-opacity duration-300",
          "bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)]",
          "bg-[size:2rem_2rem]" // Grid cell size
        )}
      />
      <div
        className={cn(
          "glow-overlay", // Class for CSS targeting
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          "bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),var(--glow-color)_0%,transparent_30%)]"
        )}
      />
    </div>
  );
};
