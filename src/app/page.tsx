'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { type LoginResult, type UserData, type BannedDetails } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingScreen } from '@/components/auth/loading-screen';
import { LoginForm } from '@/components/auth/login-form';
import { SignupForm } from '@/components/auth/signup-form';
import { BackgroundImage } from '@/components/auth/background-image';
import { BannedScreen } from '@/components/auth/banned-screen';
import { PermissionNotice } from '@/components/auth/permission-notice';
import { ServerErrorScreen } from '@/components/auth/server-error-screen';
import { QuickLoginForm } from '@/components/auth/quick-login-form';

type AppState = 'permission' | 'loading' | 'auth' | 'quickLogin' | 'loggedIn' | 'banned' | 'serverError';
type AuthMode = 'login' | 'signup';

const LoggedInScreen: FC<{ user: UserData; onLogout: () => void }> = ({ user, onLogout }) => {
  useEffect(() => {
    if (user) {
      window.location.href = 'file:///android_asset/htmlapp/root/main.html';
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary">Redirecting...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p>Login successful. Preparing your dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
};


export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [bannedDetails, setBannedDetails] = useState<BannedDetails | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quickLoginUser, setQuickLoginUser] = useState<UserData | null>(null);
  const [autoOpen, setAutoOpen] = useState(false);
  const [isHackEffectActive, setIsHackEffectActive] = useState(false);


  useEffect(() => {
    setIsClient(true);
    const noticeAgreed = localStorage.getItem('permissionNoticeAgreed');
    if (!noticeAgreed) {
        setAppState('permission');
    } else {
        setAppState('loading');
    }
  }, []);

  const handlePermissionAgree = () => {
    localStorage.setItem('permissionNoticeAgreed', 'true');
    setAppState('loading');
  }

  const handleLoadingComplete = () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('api');
    const autoOpener = localStorage.getItem('autoOpener') === 'true';
    
    if(rememberMe && savedUsername && savedEmail) {
        setQuickLoginUser({username: savedUsername, email: savedEmail});
        setAutoOpen(autoOpener);
        setAppState('quickLogin');
    } else {
        setAppState('auth');
    }
  };

  const handleLoginResult = (result: LoginResult) => {
    if (result.success && result.data && result.status === 'approved') {
        const user = result.data as UserData;
        window.parent.postMessage({ 
          type: "loginSuccess", 
          username: user.username,
          api: user.email 
        }, "*");
        setLoggedInUser(user);
        setAppState('loggedIn');
    } else if (result.status === 'banned' && result.data) {
        localStorage.setItem("failedKey", "true");
        window.parent.postMessage({ type: "ban" }, "*");
        setBannedDetails(result.data as BannedDetails);
        setAppState('banned');
    } else if (result.status === 'error') {
        setAppState('serverError');
    }
  };
  
  const handleLogout = () => {
    // We keep username and api key for the quick login form, but remove success key.
    localStorage.removeItem('successKey');
    localStorage.removeItem('failedKey');
    setLoggedInUser(null);
    setBannedDetails(null);
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    if(rememberMe && quickLoginUser){
        setAppState('quickLogin');
    } else {
        setAppState('auth');
        setAuthMode('login');
    }
    setIsFlipped(false);
  };
  
  const handleExitQuickLogin = () => {
    // only disable auto login toggles, keep credentials
    localStorage.setItem('rememberMe', 'false');
    localStorage.setItem('autoOpener', 'false');
    setQuickLoginUser(null);
    setAppState('auth');
  }

  const toggleAuthMode = () => {
    setIsFlipped(prev => !prev);
    setTimeout(() => {
      setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    }, 250);
  }
  
  const CurrentScreen = () => {
    if (!isClient) {
      return null;
    }
    switch (appState) {
      case 'permission':
        return <PermissionNotice onAgree={handlePermissionAgree} />;
      case 'loading':
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      case 'quickLogin':
        return quickLoginUser && <QuickLoginForm user={quickLoginUser} onLoginResult={handleLoginResult} onExit={handleExitQuickLogin} autoOpen={autoOpen} />;
      case 'auth':
        return (
          <div className="flex min-h-screen items-start justify-center p-4 pt-16 [perspective:1000px]">
             <div className={cn('relative w-full max-w-lg transition-transform duration-700 [transform-style:preserve-3d]', { '[transform:rotateY(180deg)]': isFlipped })}>
                <div className="absolute w-full [backface-visibility:hidden]">
                    <LoginForm onSignupClick={toggleAuthMode} onLoginResult={handleLoginResult} onHackEffectToggle={setIsHackEffectActive} />
                </div>
                <div className="absolute w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <SignupForm onLoginClick={toggleAuthMode} />
                </div>
            </div>
          </div>
        );
      case 'loggedIn':
        return (
             <div className="flex min-h-screen items-center justify-center p-4">
                {loggedInUser && <LoggedInScreen user={loggedInUser} onLogout={handleLogout} />}
            </div>
        );
      case 'banned':
        return bannedDetails && <BannedScreen details={bannedDetails} />;
      case 'serverError':
        return <ServerErrorScreen />;
      default:
        // Fallback to loading screen
        return <LoadingScreen onComplete={handleLoadingComplete} />;
    }
  };


  return (
    <main className={cn("relative flex min-h-screen flex-col items-center justify-center", { 'hack-effect': isHackEffectActive })}>
      <BackgroundImage />
      <div className="relative z-10 w-full">
        <CurrentScreen />
      </div>
    </main>
  );
}
