'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { createUraAccountRequest } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BackgroundImage } from '@/components/auth/background-image';
import { Separator } from '@/components/ui/separator';
import { DiwaliDecorations } from '@/components/auth/diwali-decorations';

const uraSignupSchema = z.object({
  moderatorId: z.string().min(1, 'Moderator ID is required'),
  moderatorUsername: z.string().min(3, 'Username must be at least 3 characters'),
  serverId: z.string().min(1, 'Server ID is required'),
  githubLink: z.string().url('Please enter a valid GitHub profile URL'),
  uraApiKey: z.string().min(10, 'URA API Key must be at least 10 characters'),
});

type UraSignupFormValues = z.infer<typeof uraSignupSchema>;

export default function UraSignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UraSignupFormValues>({
    resolver: zodResolver(uraSignupSchema),
    defaultValues: {
      moderatorId: '',
      moderatorUsername: '',
      serverId: '',
      githubLink: '',
      uraApiKey: '',
    },
  });

  async function onSubmit(data: UraSignupFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createUraAccountRequest(data);
      if (result.success) {
        toast({ title: 'Success!', description: result.message });
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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      <BackgroundImage />
      <DiwaliDecorations />
      <div className="relative z-10 w-full flex items-center justify-center">
        <Card className="w-full max-w-lg bg-black/50 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-primary font-bold">URA Moderator Signup</CardTitle>
                <CardDescription className="text-white/70 pt-2">Enter your moderator details to request an account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField control={form.control} name="moderatorId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moderator ID</FormLabel>
                    <FormControl><Input placeholder="your-moderator-id" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="moderatorUsername" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moderator Username</FormLabel>
                    <FormControl><Input placeholder="your-username" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="serverId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server ID</FormLabel>
                    <FormControl><Input placeholder="target-server-id" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="githubLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile Link</FormLabel>
                    <FormControl><Input placeholder="https://github.com/your-username" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="uraApiKey" render={({ field }) => (
                  <FormItem>
                    <FormLabel>URA API Key</FormLabel>
                    <FormControl><Input type="password" placeholder="your-api-key" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button type="submit" className="w-full font-semibold" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                  Request Moderator Account
                </Button>
                <Separator className="my-2 bg-white/20" />
                <Button variant="link" type="button" onClick={() => router.push('/')} className="text-white/80 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
}
