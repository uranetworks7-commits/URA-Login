'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMessagesForUser, markMessagesAsRead, type Message } from '@/app/actions';
import { UserContext } from './user-provider';
import { HelpDialog } from './help-dialog';
import { UserMessageDialog } from './user-message-dialog';

interface HelpContextType {
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
  hasUnread: boolean;
}

const HelpContext = createContext<HelpContextType>({
  isHelpOpen: false,
  setIsHelpOpen: () => {},
  hasUnread: false,
});

export const useHelp = () => useContext(HelpContext);

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUser } = useContext(UserContext);
  const hasUnread = messages.some(msg => !msg.read && msg.sender === 'URA-NETWORKS-Team');

  const fetchMessages = useCallback(async () => {
    if (currentUser) {
      const userMessages = await getMessagesForUser(currentUser.username);
      setMessages(userMessages);
    } else {
      setMessages([]);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleOpen = async () => {
    setIsHelpOpen(true);
    if (currentUser && hasUnread) {
        await markMessagesAsRead(currentUser.username);
        fetchMessages(); // re-fetch to update read status
    }
  };

  const handleClose = () => {
    setIsHelpOpen(false);
  }

  const MailButton = () => (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={handleOpen} className="text-white/70 hover:text-white hover:bg-white/10">
        <Mail className="h-5 w-5" />
      </Button>
      {hasUnread && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
      )}
    </div>
  );

  return (
    <HelpContext.Provider value={{ isHelpOpen, setIsHelpOpen, hasUnread }}>
      {children}
      {/* This renders the button inside the login form */}
      <div id="mail-icon-portal"></div> 
      {currentUser ? (
        <UserMessageDialog open={isHelpOpen} onOpenChange={handleClose} initialMessages={messages} onRefresh={fetchMessages} />
      ) : (
        <HelpDialog open={isHelpOpen} onOpenChange={handleClose} />
      )}
    </HelpContext.Provider>
  );
}

// A component to render the button via portal
export const MailButtonPortal = () => {
    const { hasUnread, setIsHelpOpen } = useHelp();
    const { currentUser } = useContext(UserContext);

    const handleOpen = async () => {
        setIsHelpOpen(true);
        if (currentUser && hasUnread) {
            await markMessagesAsRead(currentUser.username);
        }
    };
    
    if (typeof document === 'undefined') {
        return null;
    }

    const portalElement = document.getElementById('mail-icon-portal');
    if (!portalElement) {
        return null;
    }
    
    const ButtonComponent = (
        <div className="relative">
            <Button type="button" variant="ghost" size="icon" onClick={handleOpen} className="text-white/70 hover:text-white hover:bg-white/10">
                <Mail className="h-5 w-5" />
            </Button>
            {hasUnread && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            )}
        </div>
    );
    
    return ButtonComponent;
};
