"use client";

import { useEffect, useRef } from 'react';

export const GlowingGridBackground = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gridRef.current) {
        // pageX/Y give coordinates relative to the whole document
        const x = event.pageX; 
        const y = event.pageY - window.scrollY; // Adjust for scrolling to keep Y relative to viewport top for fixed element
        
        gridRef.current.style.setProperty('--mouse-x', `${x}px`);
        gridRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    
    // Attach to document to capture mouse movements anywhere on the page
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={gridRef} className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
      {/* Base grid of dots */}
      <div className="shimmer-grid-background" />
      {/* Glow effect that follows the mouse, appears on hover */}
      <div className="shimmer-glow-effect" />
    </div>
  );
};
