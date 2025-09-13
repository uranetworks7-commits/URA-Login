'use client';

import { AlertTriangle, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ServerErrorScreen() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleCustomerCareClick = () => {
    window.open('https://uranetworks7-commits.github.io/URA-CH-Help-line/', '_blank');
  }

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
