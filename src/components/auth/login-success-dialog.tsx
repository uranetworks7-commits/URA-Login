'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface LoginSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenApp: () => void;
}

export function LoginSuccessDialog({ open, onOpenChange, onOpenApp }: LoginSuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl">
            ✅ Login Successful!
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 text-base">
            Do you want to open the main app (main.html)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-2 gap-4 pt-4">
          <AlertDialogCancel asChild>
             <Button variant="outline" size="lg">Stay Here</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button size="lg" onClick={onOpenApp}>Open App</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
