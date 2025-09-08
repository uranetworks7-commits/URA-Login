'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Wifi, Bell, HardDrive, Share2, Smartphone, Zap } from 'lucide-react';

interface SettingsPopoverProps {
    onInternetAccessChange: (isAllowed: boolean) => void;
}

const getInitialState = (key: string, defaultValue: boolean): boolean => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
};

export function SettingsPopover({ onInternetAccessChange }: SettingsPopoverProps) {
    const [isNotificationAllowed, setIsNotificationAllowed] = useState(() => getInitialState('permission:notification', true));
    const [isStorageAllowed, setIsStorageAllowed] = useState(() => getInitialState('permission:storage', true));
    const [isIpAllowed, setIsIpAllowed] = useState(() => getInitialState('permission:ip', true));
    const [isInternetAllowed, setIsInternetAllowed] = useState(() => getInitialState('permission:internet', true));
    const [isDeviceAllowed, setIsDeviceAllowed] = useState(() => getInitialState('permission:device', true));
    const [isEmergencyMode, setIsEmergencyMode] = useState(() => getInitialState('emergencyMode', false));

    useEffect(() => {
        onInternetAccessChange(isInternetAllowed);
    }, [isInternetAllowed, onInternetAccessChange]);

    const createHandler = <T extends unknown>(setter: React.Dispatch<React.SetStateAction<T>>, key: string, callback?: (value: T) => void) => (value: T) => {
        setter(value);
        localStorage.setItem(key, JSON.stringify(value));
        if (callback) {
            callback(value);
        }
    };
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Settings className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/70 text-white border-white/20 backdrop-blur-lg">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none text-primary">Permissions</h4>
                        <p className="text-sm text-white/70">
                            Manage what the application can access.
                        </p>
                    </div>
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="emergency-mode" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Zap className="h-4 w-4 text-yellow-400" />
                                Emergency Mode
                            </Label>
                            <Switch id="emergency-mode" checked={isEmergencyMode} onCheckedChange={createHandler(setIsEmergencyMode, 'emergencyMode')} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="notification-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Bell className="h-4 w-4 text-primary" />
                                Allow Notification
                            </Label>
                            <Switch id="notification-permission" checked={isNotificationAllowed} onCheckedChange={createHandler(setIsNotificationAllowed, 'permission:notification')} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="storage-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <HardDrive className="h-4 w-4 text-primary" />
                                Allow Storage
                            </Label>
                            <Switch id="storage-permission" checked={isStorageAllowed} onCheckedChange={createHandler(setIsStorageAllowed, 'permission:storage')} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="ip-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Share2 className="h-4 w-4 text-primary" />
                                Allow IP Address
                            </Label>
                            <Switch id="ip-permission" checked={isIpAllowed} onCheckedChange={createHandler(setIsIpAllowed, 'permission:ip')} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="internet-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Wifi className="h-4 w-4 text-primary" />
                                Allow Internet Access
                            </Label>
                            <Switch id="internet-permission" checked={isInternetAllowed} onCheckedChange={createHandler(setIsInternetAllowed, 'permission:internet', onInternetAccessChange)} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="device-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Smartphone className="h-4 w-4 text-primary" />
                                Allow Device Info
                            </Label>
                            <Switch id="device-permission" checked={isDeviceAllowed} onCheckedChange={createHandler(setIsDeviceAllowed, 'permission:device')} />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
