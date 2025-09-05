'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

import type { BannedDetails, UserData, LoginResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingScreen } from '@/components/auth/loading-screen';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { BannedScreen } from '@/components/auth/banned-screen';
import { BackgroundImage } from '@/components/auth/background-image';

type AppState = 'loading' | 'auth' | 'banned' | 'loggedIn';
type AuthMode = 'login' | 'signup';

const LoggedInScreen: FC<{ user: UserData; onLogout: () => void }> = ({ user, onLogout }) => (
  <div className="flex items-center justify-center min-h-screen">
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">Welcome, {user.username}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <p>You are successfully logged in.</p>
        <p className="text-sm text-muted-foreground">Email: {user.email}</p>
        <Button onClick={onLogout}>Logout</Button>
      </CardContent>
    </Card>
  </div>
);

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [banDetails, setBanDetails] = useState<BannedDetails | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const successKey = localStorage.getItem('successKey');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('api');

    if (appState === 'loading' && successKey === 'true' && username && email) {
      setLoggedInUser({ username, email });
    }
  }, [appState, isClient]);

  const handleLoadingComplete = () => {
    if (loggedInUser) {
      setAppState('loggedIn');
    } else {
      setAppState('auth');
    }
  };

  const handleLoginResult = (result: LoginResult) => {
    if (result.success && result.data) {
      setLoggedInUser(result.data as UserData);
      setAppState('loggedIn');
    } else if (result.status === 'banned' && result.data) {
      setBanDetails(result.data as BannedDetails);
      setAppState('banned');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('successKey');
    localStorage.removeItem('username');
    localStorage.removeItem('api');
    localStorage.removeItem('failedKey');
    setLoggedInUser(null);
    setAppState('auth');
    setAuthMode('login');
    setIsFlipped(false);
  };

  const toggleAuthMode = () => {
    setIsFlipped(prev => !prev);
    setTimeout(() => {
      setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    }, 250); // Delay to match half of the flip animation
  }
  
  const CurrentScreen = () => {
    if (!isClient) {
      return <LoadingScreen onComplete={() => {}} />;
    }
    switch (appState) {
      case 'loading':
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      case 'auth':
        return (
          <div className="flex min-h-screen items-center justify-center [perspective:1000px]">
             <div className={cn('relative w-full max-w-sm transition-transform duration-700 [transform-style:preserve-3d]', { '[transform:rotateY(180deg)]': isFlipped })}>
                <div className="absolute w-full [backface-visibility:hidden]">
                    <LoginForm onSignupClick={toggleAuthMode} onLoginResult={handleLoginResult} />
                </div>
                <div className="absolute w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <SignupForm onLoginClick={toggleAuthMode} />
                </div>
            </div>
          </div>
        );
      case 'banned':
        return banDetails && <BannedScreen details={banDetails} />;
      case 'loggedIn':
        return loggedInUser && <LoggedInScreen user={loggedInUser} onLogout={handleLogout} />;
      default:
        return null;
    }
  };


  return (
    <div className="relative">
      <BackgroundImage />
      <div className="relative z-10">
        <CurrentScreen />
      </div>
    </div>
  );
}
