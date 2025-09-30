'use client';

import { useState, useEffect } from 'react';
import type { UserData } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TradingGraph } from './trading-graph';

interface LoginQueueScreenProps {
    user: UserData;
    onComplete: (user: UserData) => void;
}

export function LoginQueueScreen({ user, onComplete }: LoginQueueScreenProps) {
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const randomDuration = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
        setCountdown(randomDuration);
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && user) {
            onComplete(user);
        }
    }, [countdown, user, onComplete]);


    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-black/80 text-white border-primary/20 backdrop-blur-lg shadow-2xl shadow-primary/30">
                <CardHeader className="items-center text-center">
                    <CardTitle className="text-3xl font-bold text-primary">Server Busy</CardTitle>
                    <CardDescription className="text-white/80 pt-2">
                        Your login request is in a queue. Please wait a moment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-8 py-8">
                    <div className="text-center">
                        <p className="font-mono text-lg text-white/70">Time remaining:</p>
                        <p className="text-6xl font-bold text-white tracking-tighter">{countdown}s</p>
                    </div>
                    <div className="w-full h-48">
                         <TradingGraph />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    