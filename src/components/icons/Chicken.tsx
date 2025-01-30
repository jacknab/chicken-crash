import React from 'react';

export function Chicken({ size = 24, color = 'currentColor', ...props }: {
  size?: number;
  color?: string;
  [key: string]: any;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Body */}
      <path d="M12 6c2.5 0 4.5 2 4.5 4.5S14.5 15 12 15s-4.5-2-4.5-4.5S9.5 6 12 6z" />
      
      {/* Head */}
      <path d="M12 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
      
      {/* Beak */}
      <path d="M13 5l2-1" />
      
      {/* Feet */}
      <path d="M10 15l-1 3" />
      <path d="M14 15l1 3" />
      
      {/* Wing */}
      <path d="M15 10c1-1 2-1 3-.5" />
    </svg>
  );
}
