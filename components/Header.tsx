'use client';

import { useState, useRef } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 border-b-2 border-neon-green/20 backdrop-blur-md">
      {/* Decorative Top Scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-green opacity-50 shadow-[0_0_10px_#39FF14]" />
      
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col gap-4">
          
          {/* Top Row: Logo and Actions */}
          <div className="flex items-center justify-between">
            <div className="relative group cursor-pointer select-none">
              <h1 className="text-2xl font-black tracking-tighter text-neon-green font-mono uppercase italic 
                             group-hover:animate-pulse transition-all">
                <span className="text-white opacity-50 text-sm align-top mr-1">SYS:</span>
                HACKWALL
              </h1>
              {/* Logo Glitch Underlay */}
              <div className="absolute top-0 left-0 -z-10 text-2xl font-black tracking-tighter text-red-500 opacity-0 group-hover:opacity-50 group-hover:translate-x-1 transition-all" aria-hidden="true">
                HACKWALL
              </div>
            </div>

            
          </div>

          {/* Bottom Row: Search Bar */}
          {onSearch && (
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
              <div className="relative group">
                {/* Visual Terminal Corner Decorations */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-neon-green opacity-40" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-neon-green opacity-40" />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="QUERY_DATABASE..."
                  className="w-full bg-[#0a0a0a] text-neon-green border border-neon-green/20 rounded-none px-10 py-3 
                             font-mono text-xs uppercase tracking-widest placeholder:text-neon-green/30
                             focus:outline-none focus:border-neon-green focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] 
                             transition-all duration-300"
                />
                
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="text-neon-green opacity-50 font-mono text-sm">{'>'}</span>
                </div>

                {/* Loading/Status indicator decoration */}
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-red-500 font-mono hover:underline"
                  >
                    [CANCEL]
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}