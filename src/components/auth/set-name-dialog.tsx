'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SetNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}

export function SetNameDialog({ open, onOpenChange, onSubmit }: SetNameDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    onSubmit(name);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Set Display Name</DialogTitle>
          <DialogDescription className="text-white/70">
            Enter the new name for the Loading and Login screens.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder="Enter new name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Set Name</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
