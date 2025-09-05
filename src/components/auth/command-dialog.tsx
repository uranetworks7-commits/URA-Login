'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, ChevronRight, Save, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LogEntry {
  type: 'command' | 'response' | 'error' | 'help';
  text: string;
}

// Map color names to HSL values for the theme
const colorMap: { [key: string]: string } = {
    blue: '221.2 83.2% 53.3%',
    green: '142.1 76.2% 36.3%',
    red: '0 84.2% 60.2%',
    purple: '262.1 83.3% 57.8%',
    orange: '24.6 95% 53.1%',
    yellow: '47.9 95.8% 53.1%',
    default: '262.1 83.3% 57.8%', // Default primary color
};

const availableCommands = [
    {
        command: 'change color <color>',
        description: 'Changes the primary UI color.',
        colors: `Available: ${Object.keys(colorMap).join(', ')}`,
    },
    {
        command: 'help',
        description: 'Displays this list of available commands.'
    }
]

export function CommandDialog({ open, onOpenChange }: CommandDialogProps) {
  const { toast } = useToast();
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
      {type: 'response', text: 'URA Command Interface. Type "help" for assistance.'}
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const fullCommandPrefix = "URA//APP//:";

  const handleCommand = () => {
    if (!command) return;

    setLogs(prev => [...prev, { type: 'command', text: command }]);

    const parts = command.trim().toLowerCase().split(' ');
    const action = parts[0];

    if (action === 'change' && parts[1] === 'color' && parts[2]) {
      const color = parts[2];
      if (colorMap[color]) {
        document.documentElement.style.setProperty('--primary', colorMap[color]);
        setLogs(prev => [...prev, { type: 'response', text: `UI primary color changed to ${color}.` }]);
      } else {
        setLogs(prev => [...prev, { type: 'error', text: `Error: Color "${color}" not recognized. Type 'help' to see available colors.` }]);
      }
    } else if (action === 'help') {
       const helpText = availableCommands.map(cmd => 
            `\n- ${cmd.command}: ${cmd.description}` + (cmd.colors ? `\n  ${cmd.colors}`: '')
       ).join('');
       setLogs(prev => [...prev, { type: 'help', text: `Available Commands:${helpText}` }]);
    } else {
      setLogs(prev => [...prev, { type: 'error', text: `Error: Unknown command "${command}". Type 'help' for a list of commands.` }]);
    }

    setCommand('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  }

  const handleSaveAndRestart = () => {
      toast({
          title: 'Settings Saved!',
          description: 'Restarting interface...'
      })
      onOpenChange(false);
  }
  
  useEffect(() => {
    if (open) {
        // Focus input when dialog opens
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);
  
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
             <div key={index} className={`flex gap-2 items-start ${
                 log.type === 'command' ? 'text-primary' : 
                 log.type === 'error' ? 'text-destructive' : 
                 log.type === 'help' ? 'text-cyan-400' : 
                 'text-green-400'
                }`}>
                {log.type === 'command' && <><span className="text-primary/70">{fullCommandPrefix}</span><ChevronRight className="h-4 w-4 mt-px shrink-0 text-primary/50" /></>}
                {log.type === 'response' && <span className="shrink-0 text-green-400/50">✓</span>}
                {log.type === 'error' && <span className="shrink-0 text-destructive/50">✗</span>}
                {log.type === 'help' && <HelpCircle className="h-4 w-4 mt-px shrink-0 text-cyan-400/50" />}
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
           <Button type="button" onClick={handleSaveAndRestart} variant="secondary">
            <Save className="mr-2 h-4 w-4"/>
            Save & Restart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
