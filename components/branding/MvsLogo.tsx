import React from 'react';

interface MvsLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function MvsLogo({
  className = '',
  variant = 'dark',
  size = 'md',
}: MvsLogoProps) {
  // Dimensions map
  const heights = {
    sm: 'h-6',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  // Color theme map
  const mainColor =
    variant === 'light'
      ? '#F9FAFB'
      : variant === 'gold'
      ? '#C5A880'
      : '#111827';

  const subColor =
    variant === 'light'
      ? '#9CA3AF'
      : variant === 'gold'
      ? '#E5D3B8'
      : '#4B5563';

  const accentColor = '#C5A880'; // Warm Gold accent flourish

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${heights[size]} ${className}`}>
      <svg
        viewBox="0 0 240 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full"
        aria-label="MVS CLOTHING Logo"
      >
        {/* Typographic "MVS" Interlocking Wordmark */}
        <g transform="translate(10, 5)">
          {/* M - Bold geometric strokes */}
          <path
            d="M 5 42 L 5 8 L 18 8 L 29 28 L 40 8 L 53 8 L 53 42 L 42 42 L 42 20 L 32 38 L 26 38 L 16 20 L 16 42 Z"
            fill={mainColor}
          />
          {/* V - Diagonal interlock intersecting with M & S */}
          <path
            d="M 50 8 L 65 8 L 77 34 L 89 8 L 104 8 L 86 42 L 68 42 Z"
            fill={mainColor}
          />
          {/* Accent Gold connection slash for high fashion feel */}
          <path
            d="M 66 12 L 72 12 L 61 36 L 55 36 Z"
            fill={accentColor}
            opacity="0.95"
          />
          {/* S - Sculpted high fashion curve */}
          <path
            d="M 125 15 C 125 10 118 7 110 7 C 100 7 94 12 94 18 C 94 28 124 25 124 35 C 124 40 116 43 107 43 C 96 43 90 38 89 31 L 99 31 C 100 34 103 36 108 36 C 114 36 117 34 117 31 C 117 24 87 26 87 17 C 87 10 96 5 109 5 C 122 5 129 10 130 15 Z"
            fill={mainColor}
          />
        </g>

        {/* Separator Accent Line */}
        <line
          x1="22"
          y1="51"
          x2="218"
          y2="51"
          stroke={accentColor}
          strokeWidth="1.25"
          strokeDasharray="4 2"
        />

        {/* Sub-text: CLOTHING in wide tracked typography */}
        <text
          x="120"
          y="64"
          textAnchor="middle"
          fill={subColor}
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.45em"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          CLOTHING
        </text>
      </svg>
    </div>
  );
}
