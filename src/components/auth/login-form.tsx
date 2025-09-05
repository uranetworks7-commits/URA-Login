'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogIn } from 'lucide-react';
import { loginUser, type LoginResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address. The @ symbol is mandatory.').min(1, 'Email is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSignupClick: () => void;
  onLoginResult: (result: LoginResult) => void;
}

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
      } else if (result.status === 'banned') {
          onLoginResult(result);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: result.message,
        });
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
    <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Login</CardTitle>
            <CardDescription>Suggestion: Use lowercase for username and email for best results.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} />
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
                    <Input type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
            <Button variant="link" type="button" onClick={onSignupClick}>
              Haven't an account? Create one
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
