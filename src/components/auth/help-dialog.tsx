'use client';

import { useState, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendMessage } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { UserContext } from './user-provider';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMessageSent: () => void;
}

export function HelpDialog({ open, onOpenChange, onMessageSent }: HelpDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Message cannot be empty.' });
      return;
    }
    setIsSending(true);
    try {
      const sender = currentUser?.username || 'Guest';
      const result = await sendMessage(sender, 'URA-NETWORKS-Team', message);
      if (result.success) {
        toast({ title: 'Message Sent', description: 'The support team will get back to you shortly.' });
        setMessage('');
        onMessageSent();
        onOpenChange(false);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Contact Support</DialogTitle>
          <DialogDescription className="text-white/70">
            Send a message to the URA Support Team.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80"
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSending}>
            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
