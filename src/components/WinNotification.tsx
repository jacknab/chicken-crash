import React, { useEffect, useState } from 'react';

interface WinNotificationProps {
  amount: number;
  onComplete?: () => void;
}

export function WinNotification({ amount, onComplete }: WinNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`
        fixed z-50 left-1/2 transform -translate-x-1/2
        px-6 py-3 rounded-full bg-green-500 text-white font-bold shadow-xl
        flex items-center gap-2 min-w-[120px] justify-center
        animate-win-notification pointer-events-none
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={{
        bottom: '20%',
      }}
    >
      <span className="text-lg">+${amount.toFixed(2)}</span>
    </div>
  );
}
