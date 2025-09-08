'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, LogIn, User, X } from 'lucide-react';
import { loginUser, type UserData, type LoginResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuickLoginFormProps {
  user: UserData;
  onLoginResult: (result: LoginResult) => void;
  onExit: () => void;
  autoOpen?: boolean;
  isEmergency?: boolean;
}

export function QuickLoginForm({ user, onLoginResult, onExit, autoOpen = false, isEmergency = false }: QuickLoginFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(autoOpen);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function handleQuickLogin() {
    setIsSubmitting(true);
    try {
      const result = await loginUser(user);
      if (result.success && result.status === 'approved') {
        localStorage.setItem("successKey", "true");
        onLoginResult(result);
      } else {
         localStorage.removeItem("rememberMe");
         localStorage.removeItem("autoOpener");
         if (result.status !== 'banned') {
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: result.message,
            });
        }
        onLoginResult(result);
      }
    } catch (error) {
      console.error("Quick Login submission error:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
      onExit();
    } finally {
      if (!autoOpen) {
        setIsSubmitting(false);
      }
    }
  }
  
  const handleCancel = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    onExit();
  }

  useEffect(() => {
    if (autoOpen) {
      const delay = isEmergency ? 1000 : 2000;
      timerRef.current = setTimeout(() => {
        handleQuickLogin();
      }, delay);
      return () => {
        if(timerRef.current) {
            clearTimeout(timerRef.current)
        };
      }
    }
  }, [autoOpen, isEmergency]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
        <Card className={cn(
            "w-full max-w-sm rounded-2xl border backdrop-blur-2xl transition-all duration-300",
            "border-white/20 bg-white/10 shadow-2xl shadow-black/50"
        )}>
            <CardHeader className="items-center text-center pt-8">
                <div className="p-4 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-white/20 shadow-lg">
                    <User className="h-12 w-12 text-white/90" />
                </div>
                <CardTitle className="text-3xl font-bold text-white tracking-wider pt-4">{user.username}</CardTitle>
                <CardDescription className="text-white/70 pt-1 text-sm font-light">
                  {isSubmitting && autoOpen ? "Welcome" : "Welcome back"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-8 pb-6">
                 <Button onClick={handleQuickLogin} className={cn(
                     "w-full font-bold text-base text-white transition-all duration-300",
                     "bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary hover:to-primary/80",
                     "shadow-lg shadow-primary/30 hover:shadow-primary/50",
                     "border border-primary/50 hover:border-primary",
                     "h-12 rounded-lg"
                    )} size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <LogIn className="mr-2 h-5 w-5" />
                    )}
                    Logging in...
                </Button>
                {isSubmitting && autoOpen && (
                    <Button onClick={handleCancel} variant="ghost" className="w-full font-semibold text-white/70 hover:text-white hover:bg-white/10 h-12 rounded-lg" size="lg">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                )}
            </CardContent>
            <CardFooter className="pb-8">
                 <Button variant="link" type="button" onClick={onExit} className="w-full text-white/60 hover:text-white text-xs font-light" disabled={isSubmitting && autoOpen}>
                    Not you? Login with another account
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
