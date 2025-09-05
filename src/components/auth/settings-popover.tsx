'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Wifi, Bell, HardDrive, Share2, Smartphone } from 'lucide-react';

interface SettingsPopoverProps {
    onInternetAccessChange: (isAllowed: boolean) => void;
}

export function SettingsPopover({ onInternetAccessChange }: SettingsPopoverProps) {
    const [isNotificationAllowed, setIsNotificationAllowed] = useState(true);
    const [isStorageAllowed, setIsStorageAllowed] = useState(true);
    const [isIpAllowed, setIsIpAllowed] = useState(true);
    const [isInternetAllowed, setIsInternetAllowed] = useState(true);
    const [isDeviceAllowed, setIsDeviceAllowed] = useState(true);

    const handleInternetChange = (checked: boolean) => {
        setIsInternetAllowed(checked);
        onInternetAccessChange(checked);
    }
    
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
                            <Label htmlFor="notification-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Bell className="h-4 w-4 text-primary" />
                                Allow Notification
                            </Label>
                            <Switch id="notification-permission" checked={isNotificationAllowed} onCheckedChange={setIsNotificationAllowed} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="storage-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <HardDrive className="h-4 w-4 text-primary" />
                                Allow Storage
                            </Label>
                            <Switch id="storage-permission" checked={isStorageAllowed} onCheckedChange={setIsStorageAllowed} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="ip-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Share2 className="h-4 w-4 text-primary" />
                                Allow IP Address
                            </Label>
                            <Switch id="ip-permission" checked={isIpAllowed} onCheckedChange={setIsIpAllowed} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="internet-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Wifi className="h-4 w-4 text-primary" />
                                Allow Internet Access
                            </Label>
                            <Switch id="internet-permission" checked={isInternetAllowed} onCheckedChange={handleInternetChange} />
                        </div>
                         <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 border border-white/20">
                            <Label htmlFor="device-permission" className="flex items-center gap-2 text-white/80 cursor-pointer text-sm">
                                <Smartphone className="h-4 w-4 text-primary" />
                                Allow Device Info
                            </Label>
                            <Switch id="device-permission" checked={isDeviceAllowed} onCheckedChange={setIsDeviceAllowed} />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
