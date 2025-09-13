'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ServerCrash, Bot, ShieldAlert, RefreshCw, LifeBuoy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatedTerminal } from './animated-terminal';

type Stage = 'initial' | 'crashing' | 'crashed' | 'aiIntro' | 'fixing' | 'fixFailed' | 'restarting';

const PerformanceMeter = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-white/80">
            <span>{label}</span>
            <span>{value.toFixed(0)}%</span>
        </div>
        <Progress value={value} className="h-2 bg-white/10" />
    </div>
);

const RestartingScreen = ({ onRestart }: { onRestart: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onRestart, 2000);
        return () => clearTimeout(timer);
    }, [onRestart]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
             <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white">Restarting Application</h2>
            <p className="text-white/70">Please wait...</p>
        </div>
    );
};


export function AiLoaderScreen({ onRestart }: { onRestart: () => void }) {
    const [stage, setStage] = useState<Stage>('initial');
    const [gpu, setGpu] = useState(0);
    const [performance, setPerformance] = useState(0);
    const [runState, setRunState] = useState(0);

    const handleCustomerCareClick = () => {
        window.open('https://uranetworks7-commits.github.io/URA-CH-Help-line/', '_blank');
    }

    useEffect(() => {
        if (stage === 'initial') {
            setStage('crashing');
        } else if (stage === 'crashing') {
            const timer = setTimeout(() => setStage('crashed'), 3000);
            return () => clearTimeout(timer);
        } else if (stage === 'crashed') {
            const timer = setTimeout(() => setStage('aiIntro'), 2000);
            return () => clearTimeout(timer);
        } else if (stage === 'fixing') {
            const interval = setInterval(() => {
                setGpu(p => Math.min(p + Math.random() * 5, 100));
                setPerformance(p => Math.min(p + Math.random() * 4, 100));
                setRunState(p => Math.min(p + Math.random() * 6, 100));
            }, 500);

            const timeout = setTimeout(() => {
                clearInterval(interval);
                setGpu(100);
                setPerformance(100);
                setRunState(100);
                setTimeout(() => setStage('fixFailed'), 2000);
            }, 60000); // 1 minute

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [stage]);

    const renderContent = () => {
        switch (stage) {
            case 'crashing':
                return (
                    <Card className="w-full max-w-md bg-black/70 text-white border-destructive/50 backdrop-blur-lg animate-pulse">
                        <CardHeader className="items-center">
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <CardTitle className="text-2xl text-primary">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={Math.random() * 100} className="h-2" />
                            <p className="text-center text-sm text-white/60 mt-4">System is running slow, please wait...</p>
                        </CardContent>
                    </Card>
                );
            case 'crashed':
                return (
                    <Card className="w-full max-w-md bg-black/70 text-white border-destructive/50 backdrop-blur-lg">
                        <CardHeader className="items-center text-center">
                            <ServerCrash className="h-12 w-12 text-destructive" />
                            <CardTitle className="text-2xl text-destructive">Application Crash</CardTitle>
                            <CardDescription className="text-destructive/80">The server is not responding.</CardDescription>
                        </CardHeader>
                         <CardContent className="text-center">
                            <Button variant="link" onClick={handleCustomerCareClick} className="text-blue-400 hover:text-blue-300">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                Customer Care
                            </Button>
                        </CardContent>
                    </Card>
                );
            case 'aiIntro':
                return (
                    <Card className="w-full max-w-md bg-black/70 text-white border-primary/50 backdrop-blur-lg">
                        <CardHeader className="items-center text-center">
                            <Bot className="h-12 w-12 text-primary" />
                            <CardTitle className="text-2xl text-primary">URA AI Loader</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-white/90">Hi, I am URA AI. It seems that you are unable to log in.</p>
                            <Button onClick={() => setStage('fixing')}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Attempt to Fix
                            </Button>
                        </CardContent>
                    </Card>
                );
            case 'fixing':
                return (
                    <Card className="w-full max-w-2xl bg-black/80 text-white border-primary/50 backdrop-blur-lg shadow-2xl shadow-primary/20">
                        <CardHeader className="items-center text-center">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <ShieldAlert className="h-5 w-5"/>
                                <p className="font-bold">WARNING: Do Not Close Your App</p>
                            </div>
                            <CardTitle className="text-2xl text-primary">Repairing System Files...</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <AnimatedTerminal />
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <PerformanceMeter label="GPU Acceleration" value={gpu} />
                                <PerformanceMeter label="Loader Performance" value={performance} />
                                <PerformanceMeter label="Run State" value={runState} />
                                <PerformanceMeter label="Server Connectivity" value={99} />
                           </div>
                        </CardContent>
                    </Card>
                );
            case 'fixFailed':
                 return (
                    <Card className="w-full max-w-md bg-black/70 text-white border-destructive/50 backdrop-blur-lg">
                        <CardHeader className="items-center text-center">
                            <Bot className="h-12 w-12 text-destructive" />
                            <CardTitle className="text-2xl text-destructive">URA AI Loader</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-white/90">Sorry, I am unable to fix it. Please try again later.</p>
                            <Button variant="destructive" onClick={() => setStage('restarting')}>
                                Retry
                            </Button>
                             <Button variant="link" onClick={handleCustomerCareClick} className="text-blue-400 hover:text-blue-300">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                Customer Care
                            </Button>
                        </CardContent>
                    </Card>
                );
             case 'restarting':
                return <RestartingScreen onRestart={onRestart} />;
            default:
                return null;
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            {renderContent()}
        </main>
    );
}
