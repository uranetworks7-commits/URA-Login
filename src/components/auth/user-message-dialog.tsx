'use client';

import { useState, useEffect, useContext } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendMessage, type Message } from '@/app/actions';
import { Loader2, Send } from 'lucide-react';
import { UserContext } from './user-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMessages: Message[];
  onRefresh: () => void;
}

export function UserMessageDialog({ open, onOpenChange, initialMessages, onRefresh }: UserMessageDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSubmit = async () => {
    if (!message.trim() || !currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Message cannot be empty.' });
      return;
    }
    setIsSending(true);
    try {
      const result = await sendMessage(currentUser.username, 'URA-NETWORKS-Team', message);
      if (result.success) {
        toast({ title: 'Message Sent', description: 'The support team will get back to you shortly.' });
        setMessage('');
        onRefresh(); // Refresh messages to show the sent one
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
      setIsSending(false);
    }
  };

  const sentMessages = messages.filter(m => m.sender === currentUser?.username);
  const receivedMessages = messages.filter(m => m.recipient === currentUser?.username);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-lg h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">Your Conversations</DialogTitle>
          <DialogDescription className="text-white/70">
            View messages from and send messages to the URA Support Team.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="received" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 bg-black/30">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
          <TabsContent value="received" className="flex-1 overflow-y-auto mt-2">
            <ScrollArea className="h-full pr-4">
                {receivedMessages.length === 0 ? (
                    <p className="text-center text-sm text-white/60 pt-8">No messages from the support team.</p>
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
          </TabsContent>
          <TabsContent value="sent" className="flex-1 overflow-y-auto mt-2">
             <ScrollArea className="h-full pr-4">
                 {sentMessages.length === 0 ? (
                    <p className="text-center text-sm text-white/60 pt-8">You haven't sent any messages.</p>
                ) : (
                    sentMessages.map(msg => (
                        <div key={msg.id} className="p-3 mb-2 rounded-lg bg-black/30 border border-white/20">
                            <p className="font-bold text-sm text-primary">You</p>
                            <p>{msg.text}</p>
                            <p className="text-xs text-white/50 text-right mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                        </div>
                    ))
                )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-auto pt-4 border-t border-white/20">
            <div className="w-full flex items-start gap-2">
                <Textarea
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80 flex-1 resize-none"
                    rows={2}
                />
                <Button type="submit" onClick={handleSubmit} disabled={isSending}>
                    {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
