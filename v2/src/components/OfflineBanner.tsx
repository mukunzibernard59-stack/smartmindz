import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  const [showReconnected, setShowReconnected] = React.useState(false);
  const wasOfflineRef = React.useRef(false);

  React.useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
    } else if (wasOfflineRef.current) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      wasOfflineRef.current = false;
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium transition-all duration-300 ${
        isOnline
          ? 'bg-green-500/90 text-white'
          : 'bg-destructive/90 text-destructive-foreground'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          Back online
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          You are offline — only chat history is available
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
