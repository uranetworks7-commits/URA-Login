'use client';

import { useState, useEffect } from 'react';

const lines = [
    'Initiating system diagnostics...',
    'Scanning core modules... [OK]',
    'Checking dependencies... [OK]',
    'Verifying integrity of user_session.dll... [CORRUPTED]',
    'Attempting automatic repair of user_session.dll...',
    'Decompiling... Recompiling... Patching...',
    'Applying patch v2.1.4...',
    'Re-linking dependency graph...',
    'Analyzing network stack...',
    'Pinging gateway... [22ms]',
    'Resolving DNS... [OK]',
    'Checking for firewall blockages... [NONE]',
    'Resetting connection pool...',
    'Finalizing repairs... please wait.',
    'Verification complete. System appears stable.',
];

const TypingText = ({ text, onComplete }: { text: string; onComplete: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(prev => prev + text[i]);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                onComplete();
            }
        }, 20 + Math.random() * 20); // typing speed
        return () => clearInterval(interval);
    }, [text, onComplete]);

    return <span>{displayedText}</span>;
};


export function AnimatedTerminal() {
    const [completedLines, setCompletedLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);

    const handleLineComplete = () => {
        setCompletedLines(prev => [...prev, lines[currentLineIndex]]);
        const nextIndex = currentLineIndex + 1;
        if (nextIndex < lines.length) {
            setTimeout(() => {
                setCurrentLineIndex(nextIndex);
            }, 100 + Math.random() * 300); // delay between lines
        }
    };
    
    useEffect(() => {
        const nextIndex = currentLineIndex + 1;
        if (nextIndex === lines.length) {
            // This is the last line. Once it's done typing, we don't proceed further.
        }
    }, [completedLines, currentLineIndex]);

    return (
        <div className="bg-black text-green-400 font-mono text-xs rounded-lg p-4 h-48 overflow-y-auto border border-primary/20">
            {completedLines.map((line, index) => (
                <div key={index}>
                    <span className="text-primary/50 mr-2">&gt;</span>{line}
                </div>
            ))}
            {currentLineIndex < lines.length && (
                 <div>
                    <span className="text-primary/50 mr-2">&gt;</span>
                    <TypingText text={lines[currentLineIndex]} onComplete={handleLineComplete} />
                     <span className="animate-ping">_</span>
                </div>
            )}
        </div>
    );
}
