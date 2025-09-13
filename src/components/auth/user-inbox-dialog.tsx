'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Message } from '@/app/actions';

interface UserInboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
}

export function UserInboxDialog({ open, onOpenChange, messages }: UserInboxDialogProps) {
  const receivedMessages = messages
    .filter(m => m.sender === 'URA-NETWORKS-Team')
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-lg h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">Your Inbox</DialogTitle>
          <DialogDescription className="text-white/70">
            Messages received from the URA Support Team.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-2 pr-4">
            {receivedMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-center text-sm text-white/60">Your inbox is empty.</p>
                </div>
            ) : (
                receivedMessages.map(msg => (
                    <div key={msg.id} className="p-3 mb-2 rounded-lg bg-black/30 border border-white/20">
                        <p className="font-bold text-sm text-primary">{msg.sender}</p>
                        <p>{msg.text}</p>
                        <p className="text-xs text-white/50 text-right mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                    </div>
                ))
            )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
