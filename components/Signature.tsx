'use client';

import { usePathname } from 'next/navigation';

export default function Signature() {
  const pathname = usePathname();
  
  // Don't show on login page (which also handles registration)
  if (pathname === '/login') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 text-xs text-text-tertiary/50 font-light select-none pointer-events-none z-50">
      Dani & Nono
    </div>
  );
}
