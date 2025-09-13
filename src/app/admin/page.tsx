'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { getAllMessages, sendMessage, type Message } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BackgroundImage } from '@/components/auth/background-image';

type Conversations = Record<string, Message[]>;

export default function AdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversations>({});
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const key = prompt("Enter Admin Key:");
        if (key !== 'Utkarsh225') {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'Invalid admin key.' });
            router.push('/');
        } else {
            fetchMessages();
        }
    }, [router, toast]);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const convos = await getAllMessages();
            setConversations(convos);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load messages.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyText || !selectedUser) return;
        setIsSending(true);
        try {
            const result = await sendMessage('URA-NETWORKS-Team', selectedUser, replyText);
            if (result.success) {
                setReplyText('');
                // Refresh messages to show the new reply
                await fetchMessages();
                 toast({ title: 'Success', description: 'Reply sent.' });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.message });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
        } finally {
            setIsSending(false);
        }
    };
    
    if (isLoading) {
        return (
             <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
                <BackgroundImage />
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </main>
        )
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <BackgroundImage />
            <Card className="relative z-10 w-full max-w-4xl h-[80vh] bg-black/70 text-white border-white/20 backdrop-blur-lg flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/20">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-white/80 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <CardTitle className="text-2xl text-primary font-bold">Admin Mailbox</CardTitle>
                    <div className="w-8"></div>
                </CardHeader>
                <div className="flex flex-1 overflow-hidden">
                    {/* Conversation List */}
                    <ScrollArea className="w-1/3 border-r border-white/20">
                        <div className="p-2">
                            {Object.keys(conversations).length === 0 ? (
                                <p className="p-4 text-center text-sm text-white/70">No conversations.</p>
                            ) : (
                                Object.keys(conversations).map(user => (
                                    <button
                                        key={user}
                                        onClick={() => setSelectedUser(user)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-md transition-colors",
                                            selectedUser === user ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'
                                        )}
                                    >
                                        <p className="font-semibold">{user}</p>
                                        <p className="text-xs text-white/60 truncate">{conversations[user].at(-1)?.text}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                    {/* Message View */}
                    <div className="flex-1 flex flex-col">
                        {selectedUser ? (
                            <>
                                <ScrollArea className="flex-1 p-4 space-y-4">
                                    {conversations[selectedUser]?.map(msg => (
                                        <div key={msg.id} className={cn("p-3 rounded-lg max-w-[80%]", msg.sender === 'URA-NETWORKS-Team' ? 'bg-primary/90 text-primary-foreground self-end ml-auto' : 'bg-black/30 self-start')}>
                                            <p className="font-bold text-sm">{msg.sender}</p>
                                            <p>{msg.text}</p>
                                            <p className="text-xs text-white/50 text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    ))}
                                </ScrollArea>
                                <div className="p-4 border-t border-white/20 flex items-center gap-2">
                                    <Textarea
                                        placeholder={`Reply to ${selectedUser}...`}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="bg-black/20 border-white/20 focus:ring-primary/80 flex-1 resize-none"
                                        rows={2}
                                    />
                                    <Button onClick={handleSendReply} disabled={isSending || !replyText}>
                                        {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-white/70">Select a conversation to view messages.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </main>
    );
}
