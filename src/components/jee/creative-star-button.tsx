// src/components/jee/creative-star-button.tsx
"use client";

import type { FC, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface CreativeStarButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CreativeStarButton: FC<CreativeStarButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  className,
  children,
}) => {
  if (isLoading) {
    return (
      <button
        type="button" // Or "submit" if it's meant to submit a form by default
        className={cn(
          "jee-star-button jee-star-button-loading", // Add a loading specific class
          className
        )}
        disabled
      >
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
      </button>
    );
  }

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn("jee-star-button", className)}
    >
      {children}
      <div className="jee-star-button-star-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          version="1.1"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }}
          viewBox="0 0 784.11 815.53"
        >
          <g id="Layer_x0020_1_star1">
            <path
              className="jee-star-button-fil0"
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="jee-star-button-star-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          version="1.1"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }}
          viewBox="0 0 784.11 815.53"
        >
          <g id="Layer_x0020_1_star2">
            <path
              className="jee-star-button-fil0"
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="jee-star-button-star-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          version="1.1"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }}
          viewBox="0 0 784.11 815.53"
        >
          <g id="Layer_x0020_1_star3">
            <path
              className="jee-star-button-fil0"
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="jee-star-button-star-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          version="1.1"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }}
          viewBox="0 0 784.11 815.53"
        >
          <g id="Layer_x0020_1_star4">
            <path
              className="jee-star-button-fil0"
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="jee-star-button-star-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          version="1.1"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }}
          viewBox="0 0 784.11 815.53"
        >
          <g id="Layer_x0020_1_star5">
            <path
              className="jee-star-button-fil0"
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            ></path>
          </g>
        </svg>
      </div>
      <div className="jee-star-button-star-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlSpace="preserve"
          version="1.1"
          style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }}
          viewBox="0 0 784.11 815.53"
        >
          <g id="Layer_x0020_1_star6">
            <path
              className="jee-star-button-fil0"
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            ></path>
          </g>
        </svg>
      </div>
    </button>
  );
};
