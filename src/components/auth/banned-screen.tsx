'use client';

import { useState } from 'react';
import { AlertTriangle, ShieldOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { requestUnban } from '@/app/actions';

export interface BannedDetails {
  username?: string;
  banReason?: string;
  banDuration?: string;
  unbanAt?: number;
}

export function BannedScreen({ details }: { details: BannedDetails }) {
  const { username, banReason, banDuration } = details;
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<{success: boolean; message: string; autoUnbanned?: boolean} | null>(null);

  const isPermanent = banDuration === 'Permanent';

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
      </Card>
    </div>
  );
}
