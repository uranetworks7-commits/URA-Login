'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Youtube, Instagram, Facebook, TicketPercent, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface AppCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const socialLinks = [
    { name: 'Discord', Icon: ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8253-.6183 1.2529a17.2966 17.2966 0 00-5.4856 0c-.1719-.4276-.4073-.8776-.6183-1.2529a.0741.0741 0 00-.0785-.0371 19.7363 19.7363 0 00-4.8851 1.5152.069.069 0 00-.0321.027c-1.6984 4.0458-1.6984 8.2378 0 12.2836a.069.069 0 00.0321.027 19.7538 19.7538 0 004.8851 1.5152.0741.0741 0 00.0785-.0371c.211-.3753.4464-.8253.6183-1.2529a17.2966 17.2966 0 005.4856 0c.1719.4276.4073.8776.6183 1.2529a.0741.0741 0 00.0785.0371 19.7363 19.7363 0 004.8851-1.5152.069.069 0 00.0321-.027c1.6984-4.0458 1.6984-8.2378 0-12.2836a.069.069 0 00-.0321-.027zM8.0202 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419 1.1825 0 2.157 1.0858 2.157 2.419 0 1.3333-.9745 2.419-2.157 2.419zm7.96-0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9744-2.419 2.1569-2.419 1.1825 0 2.157 1.0858 2.157 2.419 0 1.3333-.9745 2.419-2.157 2.419z"/></svg>, href: '#' },
    { name: 'Telegram', Icon: ({className}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.004.333.016.48.111.172.11.326.3.387.52.078.27.037.64-.13.99-.18.37-.45.71-.803 1.01l-1.08 1.04-4.77 4.48c-.23.2-.48.3-.74.3-.26 0-.5-.1-.71-.29-.2-.2-.3-.4-.3-.7 0-.2.1-.4.2-.6l.3-1.8 1.8-1.7c.3-.3.4-.6.3-.9-.1-.3-.4-.4-.7-.2l-2.4.9c-.3.1-.6.2-.9.2-.3 0-.6-.1-1-.4-.3-.2-.5-.5-.6-.9s0-.8.2-1.1c.2-.3.5-.6.9-.8.4-.2.8-.3 1.2-.3.4 0 .8 0 1.2.1l5.4 1.9c.5.2.9.3 1.2.3.3 0 .6-.1.8-.2.2-.1.4-.3.6-.5.1-.2.2-.5.1-.7-.1-.2-.2-.4-.3-.5-.1-.1-.3-.2-.5-.2h-.3l-3.3-1.2c-.3-.1-.5-.3-.7-.5s-.3-.4-.3-.7c0-.2.1-.5.2-.6.1-.2.3-.3.5-.4.2-.1.4-.1.6-.1s.4 0 .6.1l3.3 1.2z"/></svg>, href: '#' },
    { name: 'YouTube', Icon: Youtube, href: '#' },
    { name: 'Facebook', Icon: Facebook, href: '#' },
    { name: 'Instagram', Icon: Instagram, href: '#' },
    { name: 'GitHub', Icon: Github, href: '#' },
]

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);


export function AppCreditsDialog({ open, onOpenChange }: AppCreditsDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary text-center">App Credits</DialogTitle>
          <DialogDescription className="text-center text-white/70">
            Ultimate Revolutionary Army Network Pvt Ltd
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm text-white/90 max-h-[60vh] overflow-y-auto px-2">
            <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                <p><strong>Copyright ©️ 2025:</strong> All Right Reserved</p>
                <p><strong>Copyright Id:</strong> VLF29342293</p>
            </div>

             <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                <p><strong>Development Team:</strong> VLF-Tec & PR-Team</p>
                <p><strong>Main Owners:</strong> Yash Singh & Samir Kumar</p>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg border border-white/20">
                <p><strong>App Security:</strong> SV-10 RPO Beta</p>
                 <p className="flex items-center gap-2"><strong>AI Used:</strong> Gemini 2.5 Pro & URA Ai</p>
                <p><strong>App Id:</strong> 192792368213</p>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-lg border-white/20 text-green-400 font-semibold">
                <ShieldCheck className="h-5 w-5" />
                <span>Verified By Google</span>
                <GoogleIcon className="h-5 w-5" />
            </div>
            
            <Separator className="bg-white/20" />

            <div className="text-center">
                <p className="flex items-center justify-center gap-2 font-semibold text-primary">
                    <TicketPercent className="h-5 w-5" />
                    For Buying Hacks, Join Us
                </p>
                <div className="flex justify-center flex-wrap gap-2 mt-3">
                    {socialLinks.map(({name, Icon, href}) => (
                         <Button key={name} variant="outline" className="bg-black/20 border-white/20 hover:bg-black/40" asChild>
                            <a href={href} target="_blank" rel="noopener noreferrer">
                                <Icon className="h-5 w-5 mr-2"/> {name}
                            </a>
                        </Button>
                    ))}
                </div>
            </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
