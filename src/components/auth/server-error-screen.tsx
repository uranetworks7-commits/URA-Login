'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ServerErrorScreen() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive bg-card/80 backdrop-blur-sm shadow-2xl shadow-destructive/20">
        <CardHeader className="items-center text-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <CardTitle className="text-3xl font-bold text-destructive">Server Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <h3 className="font-semibold text-destructive">Error 404 ! Server Error</h3>
            <p className="text-sm">
                There Are Increase Work Load or Our Server Under Maintenance, Please Try Again Later.
            </p>
          </div>
          <Button onClick={handleRetry} variant="destructive">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
