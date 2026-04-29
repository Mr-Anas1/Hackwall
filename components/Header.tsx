'use client';

import { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onRandom?: () => void;
}

export default function Header({ onSearch, onRandom }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-cyber-black border-b border-cyber-border backdrop-blur-sm bg-opacity-95">
      <div className="px-4 py-4">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4 relative group">
          <h1 className="text-3xl font-cyber text-neon-green tracking-wider animate-pulse relative z-10 group-hover:animate-none">
            {'>'} HACKWALL_
          </h1>
          {onRandom && (
            <button
              onClick={onRandom}
              className="absolute right-0 bg-neon-green/10 border border-neon-green/30 text-neon-green px-3 py-1.5 rounded font-mono text-xs hover:bg-neon-green/20 hover:border-neon-green/50 transition-all"
            >
              🎲 Random
            </button>
          )}
        </div>

        {/* Search Bar */}
        {onSearch && (
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wallpapers..."
              className="w-full bg-cyber-gray text-neon-green border border-neon-green/30 rounded px-4 py-3 pl-10 font-mono text-sm focus:outline-none focus:border-neon-green focus:shadow-neon transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        )}
      </div>
    </header>
  );
}