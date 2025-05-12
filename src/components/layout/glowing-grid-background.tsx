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
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          "hover:opacity-100", // This direct hover won't work as pointer-events: none. Parent hover needed.
                               // We apply this to body via CSS or to a wrapper if more specific control is needed.
                               // For now, the CSS in globals.css targeting body:hover will trigger this if its parent is hovered.
                               // Let's make this layer visible based on a class applied on body hover (handled by CSS)
          "bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),var(--glow-color)_0%,transparent_30%)]",
          "[&.body-is-hovering]:opacity-100" // Add this class to body on hover to trigger glow
        )}
      />
    </div>
  );
};

// Add a small script in your main layout or useEffect to toggle body class
// For example, in AppLayout.tsx or RootLayout.tsx's useEffect:
// useEffect(() => {
//   const addHoverClass = () => document.body.classList.add('body-is-hovering');
//   const removeHoverClass = () => document.body.classList.remove('body-is-hovering');
//   document.body.addEventListener('mouseenter', addHoverClass);
//   document.body.addEventListener('mouseleave', removeHoverClass);
//   return () => {
//     document.body.removeEventListener('mouseenter', addHoverClass);
//     document.body.removeEventListener('mouseleave', removeHoverClass);
//   };
// }, []);
// And in globals.css:
// .body-is-hovering .fixed.inset-0 .absolute.inset-0.bg-\[radial-gradient\(circle_at_var\(--mouse-x\)_var\(--mouse-y\),var\(--glow-color\)_0%,transparent_30%\)\] {
//   opacity: 1;
// }
// Simpler for now: the radial gradient div itself can have opacity based on its parent's hover (the main gridRef div) if it had pointer events,
// or we rely on JS to apply a class to this div for the glow.
// The CSS in globals.css for `body:hover .grid-background-glow-overlay` has been removed.
// The current setup should use the --mouse-x/y variables for positioning the radial gradient.
// The opacity is handled by the second div's `hover:opacity-100` which might need a parent hover.
// Let's make the second div always render the gradient but opacity changes on body hover via global CSS.

// Simpler approach for glowing grid, modify globals.css and this component:
// globals.css:
//  .glowing-grid-overlay {
//    position: fixed; inset: 0; width: 100%; height: 100%;
//    pointer-events: none; z-index: -1;
//    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--glow-color) 0%, transparent 30%);
//    opacity: 0; transition: opacity 0.3s ease-in-out;
//  }
//  body:hover .glowing-grid-overlay { opacity: 1; }
// This component would then just be the static grid and the overlay div.
// Updated globals.css will have grid variables only.
// The hover effect for glow is on the body. The JS sets CSS variables for mouse position.
