import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, padding = 'md', onClick }: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    none: '',
  };
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-bg-secondary
        border border-border
        rounded-lg
        ${paddingClasses[padding]}
        ${hover ? 'hover:bg-bg-tertiary transition-colors duration-200 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
