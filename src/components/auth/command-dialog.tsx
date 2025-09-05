'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, ChevronRight, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LogEntry {
  type: 'command' | 'response' | 'error';
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

export function CommandDialog({ open, onOpenChange }: CommandDialogProps) {
  const { toast } = useToast();
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
      {type: 'response', text: 'URA Command Interface. Type "help" for a list of commands.'}
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const fullCommandPrefix = "URA//APP//:";

  const handleCommand = () => {
    const fullCommand = `${fullCommandPrefix} ${command}`.trim();
    if (!command) return;

    setLogs(prev => [...prev, { type: 'command', text: fullCommand }]);

    const parts = command.trim().toLowerCase().split(' ');
    const action = parts[0];

    if (action === 'change' && parts[1] === 'color' && parts[2]) {
      const color = parts[2];
      if (colorMap[color]) {
        document.documentElement.style.setProperty('--primary', colorMap[color]);
        setLogs(prev => [...prev, { type: 'response', text: `UI primary color changed to ${color}.` }]);
      } else {
        setLogs(prev => [...prev, { type: 'error', text: `Error: Color "${color}" not recognized.` }]);
      }
    } else if (action === 'help') {
       setLogs(prev => [...prev, { type: 'response', text: 'Available commands: \n- change color <colorname>\n (Available: blue, green, red, purple, orange, yellow, default)' }]);
    } else {
      setLogs(prev => [...prev, { type: 'error', text: `Error: Unknown command "${command}"` }]);
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
  }
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollableNode = scrollAreaRef.current.querySelector('div');
        if(scrollableNode) {
            scrollableNode.scrollTop = scrollableNode.scrollHeight;
        }
    }
  }, [logs]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-white/20 backdrop-blur-lg sm:max-w-[625px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Terminal /> URA Command Interface
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Enter commands to interact with the application UI.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full bg-black/50 rounded-md p-4 font-mono text-sm">
           {logs.map((log, index) => (
             <div key={index} className={`flex gap-2 items-start ${log.type === 'command' ? 'text-primary' : log.type === 'error' ? 'text-destructive' : 'text-green-400'}`}>
                {log.type === 'command' && <ChevronRight className="h-4 w-4 mt-px shrink-0" />}
                {log.type === 'response' && <span className="shrink-0">✓</span>}
                {log.type === 'error' && <span className="shrink-0">✗</span>}
                <p className="flex-1 whitespace-pre-wrap break-words">{log.text}</p>
             </div>
           ))}
        </ScrollArea>
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70 font-mono text-sm pointer-events-none">{fullCommandPrefix}</span>
             <Input
                type="text"
                placeholder="..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-black/30 border-white/20 focus:ring-primary/80 pl-[110px] font-mono"
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
