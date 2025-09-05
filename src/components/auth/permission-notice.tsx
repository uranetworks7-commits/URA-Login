'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface PermissionNoticeProps {
  onAgree: () => void;
}

export function PermissionNotice({ onAgree }: PermissionNoticeProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-black/70 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
        <CardHeader>
          <CardTitle className="text-2xl text-primary text-center">Important Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-white/90 px-8">
          <p>
            This application is owned and managed by <strong>VLF-TeC</strong> and <i>(Terminal.io)</i> Team.
          </p>
          <p>
            We require <strong>storage, device, and internet access</strong> permissions to ensure optimal functionality.
          </p>
          <p>
            Our app is fully secured and protected.
          </p>
          <p>
            Please review and adhere to our policies governing the use of this app.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
            <Button onClick={onAgree} size="lg" className="font-bold">
                I Agree ✅
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
