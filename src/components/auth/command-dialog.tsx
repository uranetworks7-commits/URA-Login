'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, ChevronRight, Save, HelpCircle, RefreshCcw, PowerOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHackEffectToggle: (isActive: boolean) => void;
}

interface LogEntry {
  type: 'command' | 'response' | 'error' | 'help' | 'special';
  text: string;
}

const colorMap: { [key: string]: string } = {
    blue: '221.2 83.2% 53.3%',
    green: '142.1 76.2% 36.3%',
    red: '0 84.2% 60.2%',
    purple: '262.1 83.3% 57.8%',
    orange: '24.6 95% 53.1%',
    yellow: '47.9 95.8% 53.1%',
    default: '262.1 83.3% 57.8%',
};
const colorCycle = Object.keys(colorMap).filter(c => c !== 'default');

const availableCommands = [
    { command: 'help', description: 'Displays this list of available commands.' },
    { command: 'swapcolor', description: 'Cycles through available UI colors.' },
    { command: 'hackeffect', description: 'Toggles a visual hacking effect on the screen.' },
    { command: 'showhidecommand', description: 'Reveals hidden special commands.' },
];

const specialCommands = [
     { command: 'matrix', description: 'Initiates matrix rain effect (not implemented).'},
     { command: 'godmode', description: 'Unlocks all features (not implemented).'},
]


export function CommandDialog({ open, onOpenChange, onHackEffectToggle }: CommandDialogProps) {
  const { toast } = useToast();
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
      {type: 'response', text: 'URA Command Interface. Type "help" for assistance.'}
  ]);
  const [colorIndex, setColorIndex] = useState(0);
  const originalPrimaryColor = useRef<string | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const fullCommandPrefix = "URA//APP//:";

  const handleCommand = () => {
    if (!command) return;

    setLogs(prev => [...prev, { type: 'command', text: command }]);
    const action = command.trim().toLowerCase();

    switch(action) {
        case 'help': {
            const helpText = availableCommands.map(cmd => 
                `\n- ${cmd.command}: ${cmd.description}`
            ).join('');
            setLogs(prev => [...prev, { type: 'help', text: `Available Commands:${helpText}` }]);
            break;
        }
        case 'swapcolor': {
            const nextColorIndex = (colorIndex + 1) % colorCycle.length;
            const nextColorName = colorCycle[nextColorIndex];
            document.documentElement.style.setProperty('--primary', colorMap[nextColorName]);
            setLogs(prev => [...prev, { type: 'response', text: `UI primary color changed to ${nextColorName}.` }]);
            setColorIndex(nextColorIndex);
            break;
        }
        case 'hackeffect': {
            onHackEffectToggle(prev => {
                setLogs(prevLogs => [...prevLogs, { type: 'response', text: `Hack effect ${!prev ? 'activated' : 'deactivated'}.` }]);
                return !prev;
            });
            break;
        }
        case 'showhidecommand': {
             const specialText = specialCommands.map(cmd => 
                `\n- ${cmd.command}: ${cmd.description}`
             ).join('');
             setLogs(prev => [...prev, { type: 'special', text: `Hidden Commands Unlocked:${specialText}` }]);
             break;
        }
        default: {
             setLogs(prev => [...prev, { type: 'error', text: `Error: Unknown command "${command}". Type 'help' for a list of commands.` }]);
        }
    }

    setCommand('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  }

  const handleReset = () => {
      if (originalPrimaryColor.current) {
        document.documentElement.style.setProperty('--primary', originalPrimaryColor.current);
      }
      onHackEffectToggle(false);
      setLogs([{type: 'response', text: 'UI has been reset to default state.'}]);
      toast({
          title: 'UI Reset',
          description: 'All CMD modifications have been reverted.'
      })
  }
  
  useEffect(() => {
    if (open) {
        if (!originalPrimaryColor.current) {
            originalPrimaryColor.current = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        }
        setTimeout(() => inputRef.current?.focus(), 100);
    } else {
        onHackEffectToggle(false); // Turn off effect when closing dialog
    }
  }, [open, onHackEffectToggle]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector('div');
        if(scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [logs]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-[625px] flex flex-col h-[70vh] shadow-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Terminal /> URA Command Interface
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Enter commands to interact with the application UI. Type `help` for a list of commands.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full bg-black/50 rounded-md p-4 font-mono text-sm border border-primary/20">
           {logs.map((log, index) => (
             <div key={index} className={cn('flex gap-2 items-start', {
                 'text-primary': log.type === 'command',
                 'text-destructive': log.type === 'error',
                 'text-cyan-400': log.type === 'help',
                 'text-yellow-400': log.type === 'special',
                 'text-green-400': log.type === 'response'
                })}>
                {log.type === 'command' && <><span className="text-primary/70">{fullCommandPrefix}</span><ChevronRight className="h-4 w-4 mt-px shrink-0 text-primary/50" /></>}
                {log.type === 'response' && <span className="shrink-0 text-green-400/50">✓</span>}
                {log.type === 'error' && <span className="shrink-0 text-destructive/50">✗</span>}
                {log.type === 'help' && <HelpCircle className="h-4 w-4 mt-px shrink-0 text-cyan-400/50" />}
                {log.type === 'special' && <span className="shrink-0 text-yellow-400/50">⚡</span>}

                <p className="flex-1 whitespace-pre-wrap break-words">{log.text}</p>
             </div>
           ))}
        </ScrollArea>
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 font-mono text-sm pointer-events-none">{fullCommandPrefix}</span>
             <Input
                ref={inputRef}
                type="text"
                placeholder="..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-black/30 border-primary/20 focus:ring-primary/80 pl-[100px] font-mono"
            />
          </div>
          <Button type="submit" onClick={handleCommand} variant="outline" className="bg-primary/80 hover:bg-primary border-0">
            Execute
          </Button>
           <Button type="button" onClick={handleReset} variant="secondary">
            <RefreshCcw className="mr-2 h-4 w-4"/>
            Reset
          </Button>
           <Button type="button" onClick={() => onOpenChange(false)} variant="destructive">
            <PowerOff className="mr-2 h-4 w-4"/>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
