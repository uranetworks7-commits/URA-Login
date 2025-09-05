'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldOff, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface BannedDetails {
  banReason?: string;
  banDuration?: string;
  unbanAt?: number;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (unbanAt: number): Countdown | null => {
  const difference = unbanAt - Date.now();
  if (difference <= 0) {
    return null;
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export function BannedScreen({ details }: { details: BannedDetails }) {
  const { banReason, banDuration, unbanAt } = details;
  const [timeLeft, setTimeLeft] = useState<Countdown | null>(unbanAt ? calculateTimeLeft(unbanAt) : null);

  useEffect(() => {
    if (!unbanAt) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(unbanAt);
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        clearInterval(timer);
        // Optionally trigger a page refresh to allow login attempt
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unbanAt]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive bg-card/80 backdrop-blur-sm shadow-2xl shadow-destructive/20">
        <CardHeader className="items-center text-center">
          <ShieldOff className="h-16 w-16 text-destructive" />
          <CardTitle className="text-3xl font-bold text-destructive">Account Banned</CardTitle>
          <CardDescription className="text-destructive/80">
            Your account has been temporarily or permanently suspended.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <h3 className="font-semibold text-destructive">Ban Details</h3>
            <p className="text-sm">
              <span className="font-medium">Reason:</span> {banReason || 'Suspicious activity detected.'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Duration:</span> {banDuration || 'Permanent'}
            </p>
          </div>

          {timeLeft && unbanAt && banDuration !== 'Permanent' && (
            <div className="space-y-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <h3 className="flex items-center justify-center gap-2 font-semibold text-yellow-600 dark:text-yellow-400">
                <Timer className="h-5 w-5" />
                Time Until Unban
              </h3>
              <div className="font-mono text-2xl tracking-widest text-yellow-700 dark:text-yellow-300">
                {String(timeLeft.days).padStart(2, '0')}:
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <p className="text-xs text-muted-foreground">d:h:m:s</p>
            </div>
          )}
          
          {!timeLeft && banDuration !== 'Permanent' && unbanAt && (
             <div className="space-y-4">
                <p className="text-green-600 dark:text-green-400">Your ban duration is over.</p>
                <Button onClick={handleRefresh}>Click here to Login</Button>
            </div>
          )}

          {banDuration === 'Permanent' && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">This ban is permanent.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
