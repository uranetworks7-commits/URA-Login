'use client';

import { useState } from 'react';
import { Check, Clipboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BackgroundImage } from '@/components/auth/background-image';
import { useRouter } from 'next/navigation';
import { availableCommands } from '@/components/auth/command-list';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CommandsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

    const handleCopy = (command: string) => {
        navigator.clipboard.writeText(command);
        setCopiedCommand(command);
        toast({ title: 'Copied!', description: `Command "${command}" copied to clipboard.`});
        setTimeout(() => setCopiedCommand(null), 2000);
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <BackgroundImage />
            <div className="relative z-10 w-full flex items-center justify-center">
                <Card className="w-full max-w-2xl bg-black/70 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl text-primary font-bold">Available CMD Commands</CardTitle>
                        <CardDescription className="text-white/70 pt-2">Here is a list of all commands you can use in the CMD interface.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-4">
                                {availableCommands.map((cmd) => (
                                    <div key={cmd.command} className="flex items-center justify-between rounded-lg bg-black/20 p-4 border border-white/20">
                                        <div>
                                            <p className="font-mono text-primary">{cmd.command}</p>
                                            <p className="text-sm text-white/80">{cmd.description}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(cmd.command)}
                                            className="text-white/70 hover:text-white hover:bg-white/10"
                                        >
                                            {copiedCommand === cmd.command ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                     <CardHeader className="text-center pt-6">
                         <Button variant="link" type="button" onClick={() => router.push('/')} className="text-white/80 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </CardHeader>
                </Card>
            </div>
        </main>
    )
}
