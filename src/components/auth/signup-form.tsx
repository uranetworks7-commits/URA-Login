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
import { Separator } from '@/components/ui/separator';

const signupSchema = z.object({
  username: z.string()
    .transform(val => val.toLowerCase())
    .refine(val => val.length >= 2, { message: 'Username must be at least 2 characters.'})
    .refine(val => val.includes('@'), { message: 'Username must contain the @ symbol.' }),
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
      terms: true,
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
    <Card className="w-full max-w-lg bg-black/50 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary font-bold">Create Account</CardTitle>
            <CardDescription className="text-white/70 pt-2">Suggestions System 2.0: Please enter everything in small letters.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input placeholder="your_username" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="m@example.com" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="captcha" render={({ field }) => (
                <FormItem>
                  <FormLabel>Captcha: What is {captcha.num1} + {captcha.num2}?</FormLabel>
                  <FormControl><Input type="number" placeholder="?" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-4 bg-white/10 border-white/20">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal text-white">
                        I agree to the <TermsDialog />
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
            <Button type="submit" className="w-full font-semibold" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Request Account
            </Button>
            <Separator className="my-2 bg-white/20" />
            <Button variant="link" type="button" onClick={onLoginClick} className="text-white/80 hover:text-white">
              Already have an account? Login
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
