'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { requestReactivation } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { BackgroundImage } from '@/components/auth/background-image';
import { TermsDialog } from '@/components/auth/terms-dialog';

const reactivateSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  reason: z.string().min(1, 'A reason is required').default('Sorry, Now i am Regular'),
  captcha: z.string().min(1, 'Captcha is required'),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions.' }),
});

type ReactivateFormValues = z.infer<typeof reactivateSchema>;

export default function ReactivatePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });

  useEffect(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
  }, []);

  const form = useForm<ReactivateFormValues>({
    resolver: zodResolver(reactivateSchema),
    defaultValues: {
      username: '',
      email: '',
      reason: 'Sorry, Now i am Regular',
      captcha: '',
      terms: true,
    },
  });

  async function onSubmit(data: ReactivateFormValues) {
    if (parseInt(data.captcha, 10) !== captcha.answer) {
      toast({ variant: 'destructive', title: 'Error', description: 'Incorrect CAPTCHA answer.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestReactivation(data);
      if (result.success) {
        toast({ title: 'Success!', description: result.message, duration: 5000 });
        router.push('/');
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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <BackgroundImage />
      <div className="relative z-10 w-full flex items-center justify-center">
        <Card className="w-full max-w-lg bg-black/70 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="text-center">
                 <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="absolute top-4 left-4 text-white/80 hover:text-white hover:bg-white/10">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-3xl text-primary font-bold pt-2">Reactivate Account</CardTitle>
                <CardDescription className="text-white/70 pt-2">Your account was deactivated due to inactivity. Submit a request to reactivate it.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl><Input placeholder="your_username" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="m@example.com" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Tell us why you want to reactivate"
                            className="resize-none bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="captcha" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Captcha: What is {captcha.num1} + {captcha.num2}?</FormLabel>
                    <FormControl><Input type="number" placeholder="?" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
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
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                  Submit Reactivation Request
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
}
