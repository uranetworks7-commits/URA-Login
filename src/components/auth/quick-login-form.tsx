'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogIn, User } from 'lucide-react';
import { loginUser, type UserData, type LoginResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface QuickLoginFormProps {
  user: UserData;
  onLoginResult: (result: LoginResult) => void;
  onExit: () => void;
}

export function QuickLoginForm({ user, onLoginResult, onExit }: QuickLoginFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleQuickLogin() {
    setIsSubmitting(true);
    try {
      const result = await loginUser(user);
      if (result.success && result.status === 'approved') {
        localStorage.setItem("successKey", "true");
        onLoginResult(result);
      } else {
         localStorage.removeItem("rememberMe");
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
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-black/50 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
            <CardHeader className="items-center text-center">
                <div className="p-4 rounded-full bg-primary/20 border-2 border-primary">
                    <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl text-primary font-bold pt-4">{user.username}</CardTitle>
                <CardDescription className="text-white/70 pt-1">Welcome back!</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleQuickLogin} className="w-full font-semibold" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogIn className="mr-2 h-4 w-4" />
                    )}
                    Login as {user.username}
                </Button>
            </CardContent>
            <CardFooter>
                 <Button variant="link" type="button" onClick={onExit} className="w-full text-white/60 hover:text-white">
                    Not you? Log in with another account
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
