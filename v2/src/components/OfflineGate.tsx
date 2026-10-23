import React from 'react';

/**
 * Pass-through wrapper. Previously blocked tools when offline,
 * but we now let users access all menus regardless of connectivity.
 * Individual features that need the network will surface their own errors.
 */
const OfflineGate: React.FC<{ children: React.ReactNode; toolName?: string }> = ({ children }) => {
  return <>{children}</>;
};

export default OfflineGate;
