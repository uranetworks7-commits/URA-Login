'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogIn, Github, MoreVertical, Zap, BatteryCharging, Sparkles, Terminal, Settings } from 'lucide-react';
import { loginUser, type LoginResult } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { CommandDialog } from './command-dialog';
import { SettingsPopover } from './settings-popover';
import { Checkbox } from '@/components/ui/checkbox';
import { TermsDialog } from './terms-dialog';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().min(1, 'Email is required'),
  rememberMe: z.boolean().default(false),
  autoOpener: z.boolean().default(false),
  terms: z.boolean().default(true),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSignupClick: () => void;
  onLoginResult: (result: LoginResult) => void;
  onHackEffectToggle: (isActive: boolean) => void;
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

const UraIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);


export function LoginForm({ onSignupClick, onLoginResult, onHackEffectToggle }: LoginFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isInternetAllowed, setIsInternetAllowed] = useState(true);

  const [defaultValues, setDefaultValues] = useState({ username: '', email: '', rememberMe: false, autoOpener: false, terms: true });

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('api');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const autoOpener = localStorage.getItem('autoOpener') === 'true';

    if (savedUsername && savedEmail) {
      setDefaultValues({ username: savedUsername, email: savedEmail, rememberMe: rememberMe, autoOpener: autoOpener, terms: true });
    }
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
    values: defaultValues,
  });
  
  useEffect(() => {
      form.reset(defaultValues)
  }, [defaultValues, form]);


  async function onSubmit(data: LoginFormValues) {
    if (!isInternetAllowed) {
        toast({
            variant: 'destructive',
            title: 'Network Error',
            description: 'Internet access is disabled in settings.',
        });
        return;
    }
      
    setIsSubmitting(true);
    try {
      const result = await loginUser(data);
      
      if (result.success && result.status === 'approved') {
          localStorage.setItem("successKey", "true");
          localStorage.setItem("username", data.username);
          localStorage.setItem("api", data.email);
          localStorage.setItem("rememberMe", data.rememberMe ? "true" : "false");
          localStorage.setItem("autoOpener", data.autoOpener ? "true" : "false");

      } else {
         localStorage.setItem("rememberMe", "false");
         localStorage.setItem("autoOpener", "false");
         if (result.status !== 'banned') {
            toast({
              variant: 'destructive',
              title: 'Login Failed',
              description: result.message,
            });
        }
      }
      onLoginResult(result);

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
  
  const handleGoogleClick = () => {
    const savedEmail = localStorage.getItem('api');
    if (savedEmail) {
        toast({
            title: 'Account Already Chosen',
            description: `Continuing with ${savedEmail}.`,
        });
    } else {
        toast({
            title: 'No Account Found',
            description: 'Please sign in with Google.',
        });
    }
  };

  return (
    <>
    <Card className="w-full max-w-lg bg-black/50 text-white border-white/20 backdrop-blur-lg shadow-2xl shadow-black/50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center relative">
            <CardTitle className="text-3xl text-primary font-bold">Login</CardTitle>
            <CardDescription className="text-white/70 pt-2">Enter your credentials to access your account.</CardDescription>
            <div className="absolute top-4 right-4">
                <SettingsPopover onInternetAccessChange={setIsInternetAllowed} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Your Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your_username" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80 text-white" />
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
                  <FormLabel className="text-white/80">Your Email Id</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="m@example.com" {...field} className="bg-black/20 border-white/20 focus:bg-black/30 focus:ring-primary/80 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full bg-black/20 border-white/20 hover:bg-black/30 text-white">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Aura Access
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black/70 text-white border-white/20 backdrop-blur-lg">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-primary">Aura Access</h4>
                    <p className="text-sm text-white/70">
                      Manage auto-login and other experimental features.
                    </p>
                  </div>
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <FormLabel className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Zap className="h-4 w-4 text-primary" />
                                Auto Login
                            </FormLabel>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                      )}
                    />
                      <FormField
                      control={form.control}
                      name="autoOpener"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <FormLabel className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <BatteryCharging className="h-4 w-4 text-primary" />
                                Auto Opener
                            </FormLabel>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!form.watch('rememberMe')}
                                />
                            </FormControl>
                        </FormItem>
                      )}
                    />
                    <Separator className="my-1 bg-white/20" />
                    <Button variant="outline" className="w-full bg-black/20 border-white/20 hover:bg-black/30 text-white" onClick={() => setIsCmdOpen(true)}>
                        <Terminal className="mr-2 h-4 w-4" />
                        Open CMD
                    </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" className="w-full bg-black/20 border-white/20 hover:bg-black/30 text-white" onClick={() => toast({ title: 'Please Create A GitHub Account' })}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
                <Button type="button" variant="outline" className="w-full bg-black/20 border-white/20 hover:bg-black/30 text-white" onClick={handleGoogleClick}>
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Google
                </Button>
            </div>
            
            <div className="relative flex items-center justify-between py-2">
                 <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal text-white/80 text-sm -translate-y-px">
                            Accept <TermsDialog />
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/80 bg-transparent border-none hover:bg-white/10 rounded-full h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/80 text-white border-white/20">
                        <DropdownMenuItem onClick={() => router.push('/signup-ura')} className="cursor-pointer hover:bg-primary/20">
                            <UraIcon className="mr-2 h-4 w-4 text-primary" />
                            <span>Login with URA</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-2">
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
    <CommandDialog open={isCmdOpen} onOpenChange={setIsCmdOpen} onHackEffectToggle={onHackEffectToggle} />
    </>
  );
}
