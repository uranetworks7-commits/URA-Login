'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function TermsDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto -translate-y-px">
          Terms and Conditions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>📘 Account Creation Rules</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4 text-left text-foreground">
              <p>
                <strong>1.</strong> Suggestion: Use lowercase for username and email for best results.
              </p>
              <p>
                <strong>2.</strong> Once you submit your request, your account will be reviewed by an administrator. This may take 24-48 hours. Please be patient.
              </p>
              <p>
                <strong>3.</strong> If we detect the creation of multiple fake accounts from a single entity, we reserve the right to block or delete all associated accounts.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
