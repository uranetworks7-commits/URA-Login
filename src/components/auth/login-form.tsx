'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogIn, Github } from 'lucide-react';
import { loginUser, type LoginResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address. The @ symbol is mandatory.').min(1, 'Email is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSignupClick: () => void;
  onLoginResult: (result: LoginResult) => void;
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        <path d="M1 1h22v22H1z" fill="none"/>
    </svg>
);


export function LoginForm({ onSignupClick, onLoginResult }: LoginFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [defaultValues, setDefaultValues] = useState({ username: '', email: '' });

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('api');
    if (savedUsername && savedEmail) {
      setDefaultValues({ username: savedUsername, email: savedEmail });
    }
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
    values: defaultValues, // To pre-fill form
  });
  
  useEffect(() => {
      form.reset(defaultValues)
  }, [defaultValues, form]);


  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const result = await loginUser(data);
      if (result.success && result.status === 'approved') {
        localStorage.setItem("username", data.username);
        localStorage.setItem("api", data.email);
        localStorage.setItem("successKey", "true");
        onLoginResult(result);
      } else {
        onLoginResult(result);
        if (result.status !== 'banned') {
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: result.message,
            });
        }
      }
    } catch (error) {
      console.error("Login submission error:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg bg-black/50 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary font-bold">Login</CardTitle>
            <CardDescription className="text-white/70 pt-2">Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex items-center gap-4">
              <Button type="button" variant="outline" className="w-full bg-black/20 border-white/20 hover:bg-black/30" onClick={() => toast({ title: 'Please Create A GitHub Account' })}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button type="button" variant="outline" className="w-full bg-black/20 border-white/20 hover:bg-black/30" onClick={() => toast({ title: 'Google Sign-In is coming soon!' })}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
            <Separator className="my-2 bg-white/20" />
            <Button variant="link" type="button" onClick={onSignupClick} className="text-white/80 hover:text-white">
              Don't have an account? Sign Up
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
