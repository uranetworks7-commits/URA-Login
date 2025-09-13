'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MessageSquarePlus, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMessagesForUser, markMessagesAsRead, type Message } from '@/app/actions';
import { UserContext } from './user-provider';
import { HelpDialog } from './help-dialog';
import { UserInboxDialog } from './user-inbox-dialog'; // New component for received messages

interface HelpContextType {
  isSendOpen: boolean;
  setIsSendOpen: (open: boolean) => void;
  isInboxOpen: boolean;
  setIsInboxOpen: (open: boolean) => void;
  hasUnread: boolean;
  fetchMessages: () => void;
  messages: Message[];
}

const HelpContext = createContext<HelpContextType>({
  isSendOpen: false,
  setIsSendOpen: () => {},
  isInboxOpen: false,
  setIsInboxOpen: () => {},
  hasUnread: false,
  fetchMessages: () => {},
  messages: [],
});

export const useHelp = () => useContext(HelpContext);

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
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

  const handleOpenInbox = async () => {
    if (!currentUser) {
        // Guests can't have an inbox. Let them send a message instead.
        setIsSendOpen(true);
        return;
    }
    setIsInboxOpen(true);
    if (hasUnread) {
        await markMessagesAsRead(currentUser.username);
        fetchMessages(); // re-fetch to update read status
    }
  };
  
  const receivedMessages = messages.filter(m => m.recipient === currentUser?.username);

  return (
    <HelpContext.Provider value={{ isSendOpen, setIsSendOpen, isInboxOpen, setIsInboxOpen, hasUnread, fetchMessages, messages }}>
      {children}
      <HelpDialog 
        open={isSendOpen} 
        onOpenChange={setIsSendOpen}
        onMessageSent={fetchMessages}
      />
      {currentUser && (
        <UserInboxDialog
          open={isInboxOpen}
          onOpenChange={setIsInboxOpen}
          messages={receivedMessages}
        />
      )}
    </HelpContext.Provider>
  );
}

// A component to render the buttons via portal
export const HelpButtonsPortal = () => {
    const { hasUnread, setIsSendOpen, setIsInboxOpen } = useHelp();
    
    if (typeof document === 'undefined') {
        return null;
    }

    const portalElement = document.getElementById('help-buttons-portal');
    if (!portalElement) {
        return null;
    }
    
    const Buttons = (
        <>
            <Button type="button" variant="ghost" size="icon" onClick={() => setIsSendOpen(true)} className="text-white/70 hover:text-white hover:bg-white/10">
                <MessageSquarePlus className="h-5 w-5" />
            </Button>
            <div className="relative">
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsInboxOpen(true)} className="text-white/70 hover:text-white hover:bg-white/10">
                    <Inbox className="h-5 w-5" />
                </Button>
                {hasUnread && (
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </div>
      </>
    );
    
    return Buttons;
};
