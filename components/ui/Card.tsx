import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  glow?: 'cyan' | 'green' | boolean;
}

export default function Card({ children, className = '', hover = false, padding = 'md', glow = false }: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    none: '',
  };
  
  const glowClass = glow === 'cyan' 
    ? 'hover:shadow-neon-cyan' 
    : glow === 'green' 
    ? 'hover:shadow-neon-green'
    : glow === true
    ? 'hover:shadow-neon-cyan'
    : '';
  
  return (
    <div
      className={`
        glass-card
        rounded-2xl
        ${paddingClasses[padding]}
        ${hover ? 'hover:scale-[1.02] transition-all duration-300 cursor-pointer' : ''}
        ${glowClass}
        relative overflow-hidden
        ${className}
      `}
      style={{
        background: 'rgba(18, 19, 26, 0.7)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}
    >
      {/* Neon highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-green/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
