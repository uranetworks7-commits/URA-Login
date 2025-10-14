'use client';

import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

const ToranFlag = () => (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
        <path d="M0 0H24L12 12L0 0Z" fill="#f59e0b"/>
        <path d="M12 12L0 20H24L12 12Z" fill="#ef4444" />
        <circle cx="12" cy="26" r="6" fill="#16a34a"/>
    </svg>
);

const Diya = ({ className }: { className?: string }) => (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
        <Flame className="text-orange-400 h-6 w-6 absolute -top-4 animate-pulse" style={{ animationDuration: '3s' }}/>
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8C1 4.13401 7.17817 1 16 1C24.8218 1 31 4.13401 31 8C31 11.866 24.8218 15 16 15C7.17817 15 1 11.866 1 8Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
        </svg>
    </div>
);

export function DiwaliDecorations() {
  return (
    <>
      {/* Top Festoon Flags (Toran) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex justify-center pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <ToranFlag key={i} />
        ))}
      </div>

      {/* Corner Diyas */}
      <div className="hidden sm:block">
        <Diya className="absolute bottom-4 left-4 z-20" />
        <Diya className="absolute bottom-4 right-4 z-20" />
      </div>
    </>
  );
}
