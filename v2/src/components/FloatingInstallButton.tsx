import React from 'react';
import { MonitorDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FloatingInstallButton: React.FC = () => {
  const { isInstallable, install } = usePWAInstall();

  const handleInstall = async () => {
    const installed = await install();
    if (installed) {
      toast.success('App installed successfully!');
    }
  };

  if (!isInstallable) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleInstall}
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground animate-bounce-soft"
            aria-label="Install Smart Mind"
          >
            <MonitorDown className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-foreground text-background">
          <p>Install Smart Mind — Think Smarter Instantly</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingInstallButton;
