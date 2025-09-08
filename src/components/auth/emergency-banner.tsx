'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyBannerProps {
  onTurnOff: () => void;
}

export function EmergencyBanner({ onTurnOff }: EmergencyBannerProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 bg-yellow-500/90 p-2 text-black shadow-lg">
      <AlertTriangle className="h-5 w-5" />
      <p className="text-sm font-semibold">
        Emergency Mode is currently active.
      </p>
      <Button
        onClick={onTurnOff}
        size="sm"
        variant="ghost"
        className="h-auto px-2 py-1 text-black hover:bg-black/10"
      >
        <X className="mr-1 h-4 w-4" />
        Turn Off
      </Button>
    </div>
  );
}
