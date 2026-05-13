import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { Button } from '@/components/ui/button';

/**
 * Wraps tools that require an internet connection.
 * If offline, shows a friendly "connect to internet" screen
 * instead of the tool. Tools that work offline (AI Writer,
 * App Planner) are NOT wrapped with this gate.
 */
const OfflineGate: React.FC<{ children: React.ReactNode; toolName?: string }> = ({ children, toolName }) => {
  const { isOnline } = useOfflineMode();

  if (isOnline) return <>{children}</>;

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <WifiOff className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">You're offline</h2>
        <p className="text-sm text-muted-foreground mb-5">
          {toolName ? `${toolName} needs` : 'This tool needs'} an internet connection to work.
          Please reconnect to continue. You can still use the AI Writer and App Planner offline.
        </p>
        <Button onClick={() => window.location.reload()} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
};

export default OfflineGate;
