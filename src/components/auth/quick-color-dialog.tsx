'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const colorMap: { [key: string]: string } = {
    blue: '221.2 83.2% 53.3%',
    green: '142.1 76.2% 36.3%',
    red: '0 84.2% 60.2%',
    purple: '262.1 83.3% 57.8%',
    orange: '24.6 95% 53.1%',
    yellow: '47.9 95.8% 53.1%',
    default: '262.1 83.3% 57.8%',
};
export const colorCycle = Object.keys(colorMap).filter(c => c !== 'default');

interface QuickColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setColorIndex: (index: number) => void;
}

export function QuickColorDialog({ open, onOpenChange, setColorIndex }: QuickColorDialogProps) {

  const handleColorSelect = (colorName: string, index: number) => {
    document.documentElement.style.setProperty('--primary', colorMap[colorName]);
    localStorage.setItem('primaryColor', colorName);
    setColorIndex(index);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 text-white border-primary/30 backdrop-blur-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Quick Color Picker</DialogTitle>
          <DialogDescription className="text-white/70">
            Select a new primary color for the UI.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {colorCycle.map((colorName, index) => (
            <Button
              key={colorName}
              onClick={() => handleColorSelect(colorName, index)}
              style={{ backgroundColor: `hsl(${colorMap[colorName]})`}}
              className="text-white font-bold capitalize transition-transform hover:scale-105"
            >
              {colorName}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
