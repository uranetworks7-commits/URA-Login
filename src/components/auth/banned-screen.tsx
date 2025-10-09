'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldOff, LifeBuoy, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { requestUnban } from '@/app/actions';
import { format } from 'date-fns';

export interface BannedDetails {
  username?: string;
  banReason?: string;
  banDuration?: string;
  unbanAt?: number;
}

const CountdownTimer = ({ unbanAt }: { unbanAt: number }) => {
    const [timeLeft, setTimeLeft] = useState(unbanAt - Date.now());

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

    if (timeLeft <= 0) {
        return <span className="text-green-400 font-bold">Ban Expired</span>;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="font-mono text-xl sm:text-2xl text-white">
            {days > 0 && <span>{days}d </span>}
            <span>{String(hours).padStart(2, '0')}h </span>
            <span>{String(minutes).padStart(2, '0')}m </span>
            <span>{String(seconds).padStart(2, '0')}s</span>
        </div>
    );
};


export function BannedScreen({ details }: { details: BannedDetails }) {
  const { username, banReason, banDuration, unbanAt } = details;
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{success: boolean; message: string; autoUnbanned?: boolean} | null>(null);

  const isPermanent = banDuration === 'Permanent';
  const isTempBan = !isPermanent && unbanAt;

  const handleUnbanRequest = async () => {
    if (!username) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot request unban. User identifier is missing.',
      });
      return;
    }
    setIsRequesting(true);
    try {
      const result = await requestUnban(username);
      setRequestStatus(result);
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Request Failed',
          description: result.message,
        });
      }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred while submitting your request.',
      });
    } finally {
        setIsRequesting(false);
    }
  };

  const handleGoToLogin = () => {
    window.location.reload();
  }

  const handleCustomerCareClick = () => {
    window.open('https://uranetworks7-commits.github.io/URA-CH-Help-line/', '_blank');
  }

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
              <span className="font-medium">Duration:</span> {banDuration || 'Not specified'}
            </p>
          </div>
          
          {isTempBan && (
            <div className="space-y-4 rounded-lg border border-white/20 bg-black/20 p-4">
                <div className="flex items-center justify-center gap-2 text-white/80">
                    <Clock className="h-5 w-5"/>
                    <h4 className="font-semibold text-lg">Time Left to Unban</h4>
                </div>
                <CountdownTimer unbanAt={unbanAt} />
                 <p className="text-xs text-white/60">
                    Unban on: {format(new Date(unbanAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
          )}

          {!isPermanent && !requestStatus?.autoUnbanned && (
            <div className="space-y-4 pt-2">
                 <p className="text-sm text-muted-foreground">
                    If you believe this is a mistake, or if your ban has expired, click here.
                </p>
                <Button onClick={handleUnbanRequest} disabled={isRequesting || !!requestStatus?.success}>
                  {isRequesting ? 'Submitting...' : (requestStatus?.success ? 'Request Submitted' : 'Request Unban')}
                </Button>
            </div>
          )}

          {requestStatus?.autoUnbanned && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-green-500 font-medium">
                {requestStatus.message}
              </p>
              <Button onClick={handleGoToLogin}>
                Go to Login
              </Button>
            </div>
          )}

          {isPermanent && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">This ban is permanent.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-4">
            <Button variant="link" onClick={handleCustomerCareClick} className="text-blue-400 hover:text-blue-300">
                <LifeBuoy className="mr-2 h-4 w-4" />
                Customer Care
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
