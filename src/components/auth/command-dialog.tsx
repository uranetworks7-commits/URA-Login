'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, ChevronRight, HelpCircle, RefreshCcw, PowerOff, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { LoginUIState } from '@/app/page';
import { QuickColorDialog, colorMap, colorCycle } from './quick-color-dialog';
import { availableCommands, specialCommands } from './command-list';
import { SetNameDialog } from './set-name-dialog';

interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHackEffectToggle: (isActive: boolean) => void;
  uiState: LoginUIState;
  setUiState: React.Dispatch<React.SetStateAction<LoginUIState>>;
  isLoginBlocked: boolean;
  setIsLoginBlocked: (isBlocked: boolean) => void;
  setLoadingTitle: (title: string) => void;
  initialLoginUiState: LoginUIState;
}

interface LogEntry {
  type: 'command' | 'response' | 'error' | 'help' | 'special';
  text: string;
}

const COMMAND_PREFIX = 'URA//:CMD/';

export function CommandDialog({ open, onOpenChange, onHackEffectToggle, uiState, setUiState, isLoginBlocked, setIsLoginBlocked, setLoadingTitle, initialLoginUiState }: CommandDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
      {type: 'response', text: `URA Command Interface. Type "${COMMAND_PREFIX}help" for assistance.`}
  ]);
  const [colorIndex, setColorIndex] = useState(0);
  const originalPrimaryColor = useRef<string | null>(null);
  const [isQuickColorOpen, setIsQuickColorOpen] = useState(false);
  const [isSetNameOpen, setIsSetNameOpen] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleCommand = () => {
    if (!command) return;

    setLogs(prev => [...prev, { type: 'command', text: command }]);

    if (!command.startsWith(COMMAND_PREFIX)) {
        setLogs(prev => [...prev, { type: 'error', text: `Error: Command must start with "${COMMAND_PREFIX}"` }]);
        setCommand('');
        return;
    }

    const commandWithoutPrefix = command.substring(COMMAND_PREFIX.length);
    const [action, ...args] = commandWithoutPrefix.trim().split(' ');
    const value = args.join(' ');


    switch(action.toLowerCase()) {
        case 'help': {
            const helpText = availableCommands.map(cmd => 
                `\n- ${COMMAND_PREFIX}${cmd.command}: ${cmd.description}`
            ).join('');
            setLogs(prev => [...prev, { type: 'help', text: `Available Commands:${helpText}` }]);
            break;
        }
        case 'viewitem': {
            router.push('/commands');
            setLogs(prev => [...prev, { type: 'response', text: `Opening commands list page...` }]);
            onOpenChange(false);
            break;
        }
        case 'blockitem': {
            setIsLoginBlocked(true);
            setLogs(prev => [...prev, { type: 'response', text: `Login form has been blocked.`}]);
            break;
        }
        case 'unblockitem': {
            setIsLoginBlocked(false);
            setLogs(prev => [...prev, { type: 'response', text: `Login form has been unblocked.`}]);
            break;
        }
        case 'setquick': {
            setIsQuickColorOpen(true);
            setLogs(prev => [...prev, { type: 'response', text: `Quick color picker opened.`}]);
            break;
        }
        case 'swapcolor': {
            const nextColorIndex = (colorIndex + 1) % colorCycle.length;
            const nextColorName = colorCycle[nextColorIndex];
            document.documentElement.style.setProperty('--primary', colorMap[nextColorName]);
            localStorage.setItem('primaryColor', nextColorName);
            setLogs(prev => [...prev, { type: 'response', text: `UI primary color changed to ${nextColorName}.` }]);
            setColorIndex(nextColorIndex);
            break;
        }
        case 'hackeffect': {
            onHackEffectToggle(!document.body.classList.contains('hack-effect'));
            setLogs(prevLogs => [...prevLogs, { type: 'response', text: `Hack effect ${!document.body.classList.contains('hack-effect') ? 'activated' : 'deactivated'}.` }]);
            break;
        }
        case 'showhidecommand': {
             const specialText = specialCommands.map(cmd => 
                `\n- ${COMMAND_PREFIX}${cmd.command}: ${cmd.description}`
             ).join('');
             setLogs(prev => [...prev, { type: 'special', text: `Hidden Commands Unlocked:${specialText}` }]);
             break;
        }
        case 'setname': {
            setIsSetNameOpen(true);
            break;
        }
        case 'set_title':
            setUiState(s => ({...s, title: value}));
            setLogs(prev => [...prev, {type: 'response', text: `Title set to "${value}"`}]);
            break;
        case 'set_subtitle':
            setUiState(s => ({...s, subtitle: value}));
            setLogs(prev => [...prev, {type: 'response', text: `Subtitle set to "${value}"`}]);
            break;
        case 'set_button':
            setUiState(s => ({...s, buttonText: value}));
            setLogs(prev => [...prev, {type: 'response', text: `Button text set to "${value}"`}]);
            break;
        case 'theme_dark':
            setUiState(s => ({...s, theme: 'dark'}));
            setLogs(prev => [...prev, {type: 'response', text: `Theme set to dark.`}]);
            break;
        case 'theme_light':
            setUiState(s => ({...s, theme: 'light'}));
            setLogs(prev => [...prev, {type: 'response', text: `Theme set to light.`}]);
            break;
        case 'set_text_color':
            setUiState(s => ({...s, textColor: value}));
            setLogs(prev => [...prev, {type: 'response', text: `Text color set to ${value}.`}]);
            break;
        case 'login_shake':
            setUiState(s => ({...s, shake: true}));
            setTimeout(() => setUiState(s => ({...s, shake: false})), 500);
            setLogs(prev => [...prev, {type: 'response', text: `Login panel shaken.`}]);
            break;
        case 'login_glow':
            setUiState(s => ({...s, glowColor: value}));
            setLogs(prev => [...prev, {type: 'response', text: `Login panel glow set to ${value}.`}]);
            break;
        case 'toast_message':
            toast({ title: 'CMD Toast', description: value });
            setLogs(prev => [...prev, {type: 'response', text: `Toast sent.`}]);
            break;
        case 'confetti':
            const end = Date.now() + (3 * 1000);
            const colors = ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'];

            (function frame() {
                if (Date.now() > end) return;

                if (typeof window !== 'undefined' && window.confetti) {
                    window.confetti({
                        particleCount: 2,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors,
                    });
                    window.confetti({
                        particleCount: 2,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors,
                    });
                }
                requestAnimationFrame(frame);
            }());
            setLogs(prev => [...prev, { type: 'response', text: 'Confetti!!!' }]);
            break;
        case 'secret_message':
             setLogs(prev => [...prev, { type: 'special', text: `The cake is a lie.` }]);
             break;
        default: {
             setLogs(prev => [...prev, { type: 'error', text: `Error: Unknown command "${action}". Type '${COMMAND_PREFIX}help' for a list of commands.` }]);
        }
    }

    setCommand('');
  };

  const handleSetNameSubmit = (newName: string) => {
    if (newName) {
        setLoadingTitle(newName);
        setLogs(prev => [...prev, {type: 'response', text: `Display name set to "${newName}"`}]);
    } else {
         setLogs(prev => [...prev, {type: 'error', text: `Name change cancelled.`}]);
    }
    setIsSetNameOpen(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  }

  const handleReset = () => {
      // Clear localStorage
      localStorage.removeItem('loginUiState');
      localStorage.removeItem('loadingTitle');
      localStorage.removeItem('isLoginBlocked');
      localStorage.removeItem('isHackEffectActive');
      localStorage.removeItem('primaryColor');

      // Reset state
      setUiState(initialLoginUiState);
      setLoadingTitle("URA Networks 2.0");
      setIsLoginBlocked(false);
      onHackEffectToggle(false);

      if (originalPrimaryColor.current) {
        document.documentElement.style.setProperty('--primary', originalPrimaryColor.current);
      } else {
        document.documentElement.style.setProperty('--primary', colorMap['default']);
      }
      
      setLogs([{type: 'response', text: 'UI has been reset to default state.'}]);
      
      toast({
          title: 'UI Reset',
          description: 'All CMD modifications have been reverted.'
      })
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.confetti) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
        script.async = true;
        document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (open) {
        if (!originalPrimaryColor.current) {
            originalPrimaryColor.current = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        }
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

  useEffect(() => {
    const savedColorName = localStorage.getItem('primaryColor') || 'default';
    const initialColorIndex = colorCycle.indexOf(savedColorName);
    setColorIndex(initialColorIndex > -1 ? initialColorIndex : 0);
  }, []);

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-[625px] flex flex-col h-[70vh] shadow-primary/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Terminal /> URA Command Interface
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Please Enter Your Command For Commit Changes
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
                {log.type === 'command' && <ChevronRight className="h-4 w-4 mt-px shrink-0 text-primary/50" />}
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
             <Input
                ref={inputRef}
                type="text"
                placeholder="URA//:CMD/code"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-black/30 border-primary/20 focus:ring-primary/80 font-mono"
            />
          </div>
          <Button type="button" onClick={() => router.push('/commands')} variant="secondary" size="icon">
            <Eye className="h-4 w-4" />
            <span className="sr-only">View All Commands</span>
          </Button>
           <Button type="button" onClick={handleReset} variant="secondary" size="icon">
            <RefreshCcw className="h-4 w-4"/>
            <span className="sr-only">Reset</span>
          </Button>
           <Button type="button" onClick={() => onOpenChange(false)} variant="destructive" size="icon">
            <PowerOff className="h-4 w-4"/>
             <span className="sr-only">Close</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <QuickColorDialog open={isQuickColorOpen} onOpenChange={setIsQuickColorOpen} setColorIndex={setColorIndex} />
    <SetNameDialog open={isSetNameOpen} onOpenChange={setIsSetNameOpen} onSubmit={handleSetNameSubmit} />
    </>
  );
}

declare global {
    interface Window {
        confetti?: any;
    }
}
