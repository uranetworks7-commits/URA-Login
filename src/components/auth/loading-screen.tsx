'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Globe, Loader } from 'lucide-react';

const DotLoading = () => (
  <span className="inline-flex items-center">
    <Loader className="animate-spin h-4 w-4 mr-2" />
    <span className="animate-pulse">.</span>
    <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
    <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
  </span>
);

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [status, setStatus] = useState('Connecting to Server...');
  const [securityStatus, setSecurityStatus] = useState('');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus('Connected to Server');
    }, 1500);

    const timer2 = setTimeout(() => {
      setSecurityStatus('Security Scaning:-');
    }, 2000);

    const timer3 = setTimeout(() => {
      setSecurityStatus('Security Check Completed');
    }, 4000);

    const finalTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 bg-transparent text-white">
      <div className="text-center rounded-xl bg-black/30 p-8 backdrop-blur-md">
        <h1 
          className="text-5xl font-bold tracking-tighter"
          style={{
            color: 'hsl(var(--primary))',
            textShadow: '0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)',
          }}
        >
          URA Networks 2.0
        </h1>
      </div>
      <div className="mt-4 w-72 space-y-3 font-mono text-sm">
        <div className="flex items-center gap-2">
          {status === 'Connected to Server' ? (
            <>
              <Globe className="h-4 w-4 text-green-400 animate-pulse" />
              <span>{status}</span>
              <ShieldCheck className="h-4 w-4 text-green-400 animate-pulse" />
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 animate-spin" />
              <span>{status}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {securityStatus && (
            <>
              <span>{securityStatus}</span>
              {securityStatus.startsWith('Security Scaning') && <DotLoading />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
