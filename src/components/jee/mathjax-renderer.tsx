"use client";

import type { FC } from 'react';
import { useEffect, useRef, memo } from 'react';

declare global {
  interface Window {
    MathJax?: { // Make MathJax optional to handle loading states
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup: {
        promise: Promise<void>;
      };
      texReset: () => void;
      InputJax: any; // Add more specific types if known
      OutputJax: any;
    };
  }
}

interface MathJaxRendererProps {
  latex: string;
  className?: string;
}

const MathJaxRenderer: FC<MathJaxRendererProps> = ({ latex, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // For actual content, separate from typesetting target

  useEffect(() => {
    const currentRef = ref.current;
    const currentContentRef = contentRef.current;

    if (currentRef && currentContentRef && typeof window.MathJax !== 'undefined' && window.MathJax.startup) {
      // Set content for MathJax to process
      currentContentRef.innerHTML = latex;

      window.MathJax.startup.promise.then(() => {
        if (window.MathJax) { // Check again inside promise
          window.MathJax.texReset?.(); // Reset TeX processor state if needed
          window.MathJax.typesetPromise([currentContentRef])
            .catch((err) => {
              console.error('MathJax typesetting error:', err);
              // Fallback to displaying raw LaTeX on error
              if(currentContentRef) currentContentRef.innerText = `Error rendering: ${latex}`;
            });
        }
      }).catch(err => console.error("MathJax startup promise error", err));
    } else if (currentContentRef) {
      // Fallback if MathJax is not available (e.g. during SSR or if script fails to load)
      currentContentRef.innerText = latex;
    }
  }, [latex]);

  return <div ref={ref} className={className}><div ref={contentRef}></div></div>;
};

export default memo(MathJaxRenderer); // Memoize to prevent re-renders if latex prop doesn't change
