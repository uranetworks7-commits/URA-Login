'use client';

import { useState } from 'react';
import { Check, Clipboard, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BackgroundImage } from '@/components/auth/background-image';
import { useRouter } from 'next/navigation';
import { availableCommands } from '@/components/auth/command-list';

const ITEMS_PER_PAGE = 6;
const COMMAND_PREFIX = 'URA//:CMD/';

export default function CommandsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(availableCommands.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCommands = availableCommands.slice(startIndex, endIndex);

    const handleCopy = (command: string) => {
        const fullCommand = `${COMMAND_PREFIX}${command.split(' ')[0]}`;
        navigator.clipboard.writeText(fullCommand);
        setCopiedCommand(command);
        toast({ title: 'Copied!', description: `Command "${fullCommand}" copied to clipboard.`});
        setTimeout(() => setCopiedCommand(null), 2000);
    };
    
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
    
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }


    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <BackgroundImage />
            <div className="relative z-10 w-full flex items-center justify-center">
                <Card className="w-full max-w-2xl bg-black/70 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
                    <CardHeader className="text-center relative">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-3xl text-primary font-bold pt-2">CMD Commands</CardTitle>
                        <div className="flex items-center justify-center w-full space-x-4 pt-4">
                            <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline" className="bg-transparent hover:bg-white/10">
                                <ArrowLeft className="mr-2 h-4 w-4"/>
                                Previous
                            </Button>
                            <span className="font-mono text-sm">Page {currentPage} of {totalPages}</span>
                             <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline" className="bg-transparent hover:bg-white/10">
                                Next
                                <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="min-h-[28rem]">
                        <div className="space-y-4">
                            {currentCommands.map((cmd) => (
                                <div key={cmd.command} className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                                    <div className="flex-1">
                                        <p className="font-mono text-primary text-sm sm:text-base">{COMMAND_PREFIX}{cmd.command}</p>
                                        <p className="text-xs sm:text-sm text-white/80">{cmd.description}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleCopy(cmd.command)}
                                        className="text-white/70 hover:text-white hover:bg-white/10 ml-2"
                                    >
                                        {copiedCommand === cmd.command ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                     <CardFooter className="flex-col gap-4 pt-4">
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}
