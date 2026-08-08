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
  // Enhanced heights map for maximum visibility
  const heights = {
    sm: 'h-7',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  // Theme colors
  const mainColor =
    variant === 'light'
      ? '#F9FAFB'
      : variant === 'gold'
      ? '#C5A880'
      : '#111827';

  const subColor =
    variant === 'light'
      ? '#D1D5DB'
      : variant === 'gold'
      ? '#F3E8D8'
      : '#374151';

  const goldAccent = '#C5A880';

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${heights[size]} ${className}`}>
      <svg
        viewBox="0 0 280 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full"
        aria-label="MVS CLOTHING Logo"
      >
        {/* Main Bold Typographic Wordmark: MVS */}
        <text
          x="140"
          y="48"
          textAnchor="middle"
          fill={mainColor}
          fontSize="48"
          fontWeight="900"
          letterSpacing="0.12em"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          style={{ textTransform: 'uppercase' }}
        >
          MVS
        </text>

        {/* Warm Gold Accent Underline */}
        <rect
          x="65"
          y="56"
          width="150"
          height="2.5"
          rx="1.25"
          fill={goldAccent}
        />

        {/* Sub-text: CLOTHING */}
        <text
          x="140"
          y="72"
          textAnchor="middle"
          fill={subColor}
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.48em"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          CLOTHING
        </text>
      </svg>
    </div>
  );
}
