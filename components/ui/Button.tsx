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
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white focus:ring-accent shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40',
    secondary: 'glass-strong hover:bg-white/15 text-text-primary focus:ring-white/20',
    outline: 'border-2 border-white/20 hover:border-accent text-text-primary hover:bg-accent/10 focus:ring-accent',
    danger: 'bg-danger hover:bg-danger/80 text-white focus:ring-danger shadow-lg shadow-danger/30',
    success: 'bg-success hover:bg-success/80 text-white focus:ring-success shadow-lg shadow-success/30',
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
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      )}
    </button>
  );
}
