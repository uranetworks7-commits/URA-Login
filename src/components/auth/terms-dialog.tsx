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
        <Button variant="link" className="p-0 h-auto -translate-y-px text-primary hover:text-primary/80">
          Terms and Conditions
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>📘 Account Creation & Usage Rules</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4 text-left text-foreground">
              <p>
                <strong>1. Account Request:</strong> Use lowercase for username and email for best results. Your request will be reviewed by an administrator, which may take 24-48 hours.
              </p>
              <p>
                <strong>2. Fair Use Policy:</strong> We reserve the right to block or delete accounts associated with the creation of multiple fakes from a single entity.
              </p>
               <p>
                <strong>3. Anti-Hacking Policy:</strong> Any attempt to hack, disrupt, or gain unauthorized access to this application or its services is strictly prohibited. We employ monitoring services, and any such activity will result in an immediate and permanent ban.
              </p>
              <p>
                <strong>4. Rights Reserved:</strong> All rights related to this application, its content, and services are reserved by VLF-TeC. Unauthorized use, reproduction, or distribution is not permitted.
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
