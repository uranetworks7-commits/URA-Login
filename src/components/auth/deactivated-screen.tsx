'use client';

import { UserX, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DeactivatedScreenProps {
  onReactivate: () => void;
  onBackToLogin: () => void;
}

export function DeactivatedScreen({ onReactivate, onBackToLogin }: DeactivatedScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-yellow-500/50 bg-card/80 backdrop-blur-sm shadow-2xl shadow-yellow-500/20">
        <CardHeader className="items-center text-center">
          <UserX className="h-16 w-16 text-yellow-500" />
          <CardTitle className="text-3xl font-bold text-yellow-500">Account Deactivated</CardTitle>
          <CardDescription className="text-yellow-500/80">
            Your account has been deactivated due to prolonged inactivity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-white/90">
            To regain access to your account, you need to submit a reactivation request.
          </p>
           <Button onClick={onReactivate} className="w-full">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Reactivate Account
          </Button>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-4">
            <Button variant="link" onClick={onBackToLogin} className="text-white/80 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
