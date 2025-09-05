'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, LogIn, User, X } from 'lucide-react';
import { loginUser, type UserData, type LoginResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface QuickLoginFormProps {
  user: UserData;
  onLoginResult: (result: LoginResult) => void;
  onExit: () => void;
  autoOpen?: boolean;
}

export function QuickLoginForm({ user, onLoginResult, onExit, autoOpen = false }: QuickLoginFormProps) {
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
      // Don't set submitting to false if it was an auto-open, as the component will unmount
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
      timerRef.current = setTimeout(() => {
        handleQuickLogin();
      }, 1500);
      return () => {
        if(timerRef.current) {
            clearTimeout(timerRef.current)
        };
      }
    }
  }, [autoOpen]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-black/50 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
            <CardHeader className="items-center text-center">
                <div className="p-4 rounded-full bg-primary/20 border-2 border-primary">
                    <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary font-bold pt-4">{user.username}</CardTitle>
                <CardDescription className="text-white/70 pt-1">
                  {isSubmitting && autoOpen ? "Automatically logging in..." : "Welcome back!"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <Button onClick={handleQuickLogin} className="w-full font-semibold" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Login as {user.username}
                </Button>
                {isSubmitting && autoOpen && (
                    <Button onClick={handleCancel} variant="destructive" className="w-full font-semibold" size="lg">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                )}
            </CardContent>
            <CardFooter>
                 <Button variant="link" type="button" onClick={onExit} className="w-full text-white/60 hover:text-white" disabled={isSubmitting && autoOpen}>
                    Not you? Log in with another account
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
