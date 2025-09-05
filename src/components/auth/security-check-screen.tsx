'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Loader } from 'lucide-react';
import { runSecurityCheckAndLogin, type UserData, type LoginResult } from '@/app/actions';

const activityLog = [
    `Logged in from a new device.`,
    `Network connection established via residential IP.`,
    `Accessed standard application routes.`,
    `Attempted to access admin-only endpoint '/api/admin/users' without permissions.`,
    `File upload detected: 'profile_pic.jpg'. Scan clean.`,
    `Multiple rapid requests to '/api/data' endpoint observed.`,
    `Using a known VPN provider for connection.`
];

const DotLoading = () => (
  <span className="inline-flex items-center">
    <Loader className="animate-spin h-4 w-4 mr-2" />
    <span className="animate-pulse">.</span>
    <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
    <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
  </span>
);


interface SecurityCheckScreenProps {
  user: UserData;
  onResult: (result: LoginResult) => void;
}

export function SecurityCheckScreen({ user, onResult }: SecurityCheckScreenProps) {
  const [status, setStatus] = useState('Initiating security scan...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performCheck = async () => {
      try {
        // Generate random activity only on the client-side
        const randomActivity = activityLog[Math.floor(Math.random() * activityLog.length)];
        const activity = `User ${user.username} ${randomActivity}`;
        
        setStatus('Analyzing user activity...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus('Checking against security policies...');
        const result = await runSecurityCheckAndLogin(user, activity);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        onResult(result);

      } catch (e) {
        console.error('Security check runtime error:', e);
        setError('A critical error occurred during the security scan.');
        const errorResult: LoginResult = {
            success: false,
            message: 'A critical error occurred during the security scan.',
            status: 'error',
        };
        onResult(errorResult);
      }
    };

    performCheck();
  }, [user, onResult]);


  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-transparent text-white">
      <div className="text-center rounded-xl bg-black/50 p-12 backdrop-blur-lg shadow-2xl">
        <h1 
          className="text-4xl font-bold tracking-tight text-primary mb-6"
        >
          Security Check
        </h1>
        <div className="w-80 space-y-4 font-mono text-sm text-left">
            <div className="flex items-center gap-3 p-2 rounded-md bg-black/20">
                {status.includes('Analyzing') || status.includes('Checking') ? (
                     <Loader className="h-5 w-5 animate-spin text-yellow-400" />
                ) : (
                    <ShieldCheck className="h-5 w-5 text-green-400" />
                )}
                <span className="flex-1">{status}</span>
                {(status.includes('Analyzing') || status.includes('Checking')) && <DotLoading />}
            </div>

            {error && (
                 <div className="flex items-center gap-3 p-2 rounded-md bg-destructive/20 text-destructive-foreground">
                    <ShieldAlert className="h-5 w-5" />
                    <span>{error}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
