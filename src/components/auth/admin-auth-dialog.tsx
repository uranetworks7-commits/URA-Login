'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

interface AdminAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ADMIN_KEY = 'Utkarsh225';

export function AdminAuthDialog({ open, onOpenChange }: AdminAuthDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [key, setKey] = useState('');

  const handleVerify = () => {
    if (key === ADMIN_KEY) {
      toast({ title: 'Success', description: 'Access granted.' });
      onOpenChange(false);
      router.push('/admin');
    } else {
      toast({ variant: 'destructive', title: 'Access Denied', description: 'Invalid admin key.' });
      onOpenChange(false);
    }
    setKey('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30">
        <DialogHeader>
          <DialogTitle>Admin Authentication</DialogTitle>
          <DialogDescription>Please enter the admin key to access the control panel.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="admin-key" className="text-right">
              Admin Key
            </Label>
            <Input
              id="admin-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyPress={handleKeyPress}
              className="col-span-3 bg-black/30 border-white/20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleVerify}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
