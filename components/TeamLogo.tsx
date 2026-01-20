'use client';

interface TeamLogoProps {
  logo?: string | null;
  flag?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function TeamLogo({ logo, flag, name = '', size = 'md', className = '' }: TeamLogoProps) {
  const isBase64Image = logo && logo.startsWith('data:image');
  const isUrlImage = logo && (logo.startsWith('http://') || logo.startsWith('https://'));
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-lg',
    md: 'w-8 h-8 text-xl',
    lg: 'w-12 h-12 text-3xl',
    xl: 'w-16 h-16 text-4xl sm:text-6xl',
  };

  if (isBase64Image || isUrlImage) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${sizeClasses[size]} object-cover rounded-lg border border-border ${className}`}
      />
    );
  }

  // Fallback to emoji or flag
  return (
    <span className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      {logo || flag || '⚽'}
    </span>
  );
}
