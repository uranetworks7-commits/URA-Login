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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-.83 0-1.5.67-1.5 1.5V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
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
