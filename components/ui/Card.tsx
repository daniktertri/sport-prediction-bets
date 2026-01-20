import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  glow?: boolean;
}

export default function Card({ children, className = '', hover = false, padding = 'md', glow = false }: CardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    none: '',
  };
  
  return (
    <div
      className={`
        glass-card
        rounded-2xl
        ${paddingClasses[padding]}
        ${hover ? 'hover:scale-[1.02] hover:border-white/20 transition-all duration-300 cursor-pointer' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(0,122,255,0.3)]' : ''}
        relative overflow-hidden
        ${className}
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      }}
    >
      {/* Glass highlight effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
