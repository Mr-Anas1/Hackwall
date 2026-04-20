'use client';

import { useCallback, useState } from 'react';
import { showInterstitialFromAdCard } from '@/lib/admob';

export default function SponsoredAdCard() {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await showInterstitialFromAdCard();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div
      onClick={onClick}
      className="col-span-2 relative overflow-hidden rounded-lg border border-cyber-border hover:border-neon-green transition-all duration-300 hover:shadow-neon active:scale-[0.99] cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="p-4 bg-cyber-gray/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-neon-green/80 font-mono text-xs tracking-widest">
              {'>'} SPONSORED_
            </p>
            <p className="text-gray-300 font-mono text-sm mt-2">
              Tap to support HackWall
            </p>
            <p className="text-gray-500 font-mono text-xs mt-1">
              {isLoading ? 'Loading ad...' : 'Open ad'}
            </p>
          </div>

          <div className="shrink-0">
            <div className="px-3 py-2 rounded-md border border-neon-green/40 text-neon-green font-mono text-xs">
              {isLoading ? '...' : 'VIEW'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
