'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UserPlus } from 'lucide-react';
import { createAccountRequest } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { TermsDialog } from './terms-dialog';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string().email('Invalid email address. The @ symbol is mandatory.'),
  captcha: z.string().min(1, 'Captcha is required'),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onLoginClick: () => void;
}

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

export function SignupForm({ onLoginClick }: SignupFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
  }, []);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      captcha: '',
      terms: false,
    },
  });

  async function onSubmit(data: SignupFormValues) {
    if (parseInt(data.captcha, 10) !== captcha.answer) {
      toast({ variant: 'destructive', title: 'Error', description: 'Incorrect CAPTCHA answer.' });
      return;
    }
    
    const lastRequestTime = localStorage.getItem('lastAccountRequestTime');
    if (lastRequestTime && (Date.now() - parseInt(lastRequestTime, 10)) < FORTY_EIGHT_HOURS_MS) {
        toast({ variant: 'destructive', title: 'Rate Limited', description: 'You can only request one account per 48 hours.' });
        return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAccountRequest({ username: data.username, email: data.email });
      if (result.success) {
        toast({ title: 'Success!', description: result.message });
        localStorage.setItem('lastAccountRequestTime', Date.now().toString());
        onLoginClick();
      } else {
        toast({ variant: 'destructive', title: 'Request Failed', description: result.message });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Create Account</CardTitle>
            <CardDescription>Your details must be verified by an admin. This may take 24-48 hours.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="your_username" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="captcha" render={({ field }) => (
                <FormItem>
                  <FormLabel>Captcha: What is {captcha.num1} + {captcha.num2}?</FormLabel>
                  <FormControl><Input type="number" placeholder="?" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the <TermsDialog />
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Create Account
            </Button>
            <Button variant="link" type="button" onClick={onLoginClick}>
              Already have an account? Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
