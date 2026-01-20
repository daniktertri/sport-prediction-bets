import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-gradient-to-r from-neon-cyan to-neon-green hover:from-neon-cyan-dark hover:to-neon-green-dark text-bg-primary focus:ring-neon-cyan shadow-lg shadow-neon-cyan/40 hover:shadow-xl hover:shadow-neon-cyan/60 hover:scale-105',
    secondary: 'glass-strong border border-neon-cyan/30 hover:border-neon-cyan/60 text-text-primary hover:text-neon-cyan focus:ring-neon-cyan hover:glow-cyan-sm',
    outline: 'border-2 border-neon-cyan/50 hover:border-neon-cyan text-text-primary hover:text-neon-cyan hover:bg-neon-cyan/10 focus:ring-neon-cyan hover:glow-cyan-sm',
    danger: 'bg-gradient-to-r from-danger to-red-600 hover:from-red-600 hover:to-danger text-white focus:ring-danger shadow-lg shadow-danger/40 hover:shadow-xl hover:shadow-danger/60',
    success: 'bg-gradient-to-r from-neon-green to-green-500 hover:from-green-500 hover:to-neon-green text-bg-primary focus:ring-neon-green shadow-lg shadow-neon-green/40 hover:shadow-xl hover:shadow-neon-green/60',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 font-bold">{children}</span>
      {(variant === 'primary' || variant === 'success') && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      )}
    </button>
  );
}
