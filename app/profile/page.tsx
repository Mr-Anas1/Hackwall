'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function ProfilePage() {
  const [theme, setTheme] = useState<'dark' | 'extra-dark'>('dark');
  const [downloadQuality, setDownloadQuality] = useState<'hd' | 'original'>('hd');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'extra-dark';
    const savedQuality = localStorage.getItem('download_quality') as 'hd' | 'original';
    
    if (savedTheme) setTheme(savedTheme);
    if (savedQuality) setDownloadQuality(savedQuality);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'extra-dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'extra-dark') {
      document.documentElement.style.setProperty('--cyber-black', '#000000');
      document.documentElement.style.setProperty('--cyber-gray', '#050505');
    } else {
      document.documentElement.style.setProperty('--cyber-black', '#000000');
      document.documentElement.style.setProperty('--cyber-gray', '#0F0F0F');
    }
  };

  const handleQualityChange = (quality: 'hd' | 'original') => {
    setDownloadQuality(quality);
    localStorage.setItem('download_quality', quality);
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="p-4">
        <h1 className="text-2xl font-cyber text-neon-green mb-6">
          {'>'} Settings_
        </h1>

        {/* Theme Settings */}
        <section className="mb-8">
          <h2 className="text-lg font-mono text-neon-green/80 mb-4">Theme</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`w-full p-4 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'bg-neon-green text-black border-neon-green shadow-neon'
                  : 'bg-cyber-gray text-neon-green/70 border-neon-green/30 hover:border-neon-green'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-mono font-semibold">Dark Mode</p>
                  <p className="text-xs opacity-70 mt-1">Standard dark theme</p>
                </div>
                {theme === 'dark' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => handleThemeChange('extra-dark')}
              className={`w-full p-4 rounded-lg border transition-all ${
                theme === 'extra-dark'
                  ? 'bg-neon-green text-black border-neon-green shadow-neon'
                  : 'bg-cyber-gray text-neon-green/70 border-neon-green/30 hover:border-neon-green'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-mono font-semibold">Extra Dark Mode</p>
                  <p className="text-xs opacity-70 mt-1">Pure black OLED theme</p>
                </div>
                {theme === 'extra-dark' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </section>

        {/* Download Quality */}
        <section className="mb-8">
          <h2 className="text-lg font-mono text-neon-green/80 mb-4">Download Quality</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleQualityChange('hd')}
              className={`w-full p-4 rounded-lg border transition-all ${
                downloadQuality === 'hd'
                  ? 'bg-neon-green text-black border-neon-green shadow-neon'
                  : 'bg-cyber-gray text-neon-green/70 border-neon-green/30 hover:border-neon-green'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-mono font-semibold">HD (1080x1920)</p>
                  <p className="text-xs opacity-70 mt-1">Optimized for mobile</p>
                </div>
                {downloadQuality === 'hd' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>

            <button
              onClick={() => handleQualityChange('original')}
              className={`w-full p-4 rounded-lg border transition-all ${
                downloadQuality === 'original'
                  ? 'bg-neon-green text-black border-neon-green shadow-neon'
                  : 'bg-cyber-gray text-neon-green/70 border-neon-green/30 hover:border-neon-green'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-mono font-semibold">Original Quality</p>
                  <p className="text-xs opacity-70 mt-1">Best quality, larger file</p>
                </div>
                {downloadQuality === 'original' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="mb-8">
          <h2 className="text-lg font-mono text-neon-green/80 mb-4">About</h2>
          <div className="bg-cyber-gray border border-neon-green/30 rounded-lg p-4">
            <p className="font-mono text-neon-green/70 text-sm mb-2">
              HackWall - Cyberpunk Wallpapers
            </p>
            <p className="font-mono text-gray-500 text-xs mb-4">
              A hacker-style wallpaper app with terminal aesthetics
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-neon-green/20">
              <span className="font-mono text-xs text-gray-500">Version</span>
              <span className="font-mono text-xs text-neon-green">1.0.0</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs text-gray-500">Build</span>
              <span className="font-mono text-xs text-neon-green">2026.02.17</span>
            </div>
          </div>
        </section>

        {/* Credits */}
        <section>
          <div className="text-center py-6">
            <p className="font-mono text-xs text-gray-600">
              Made with <span className="text-neon-green">{'<3'}</span> by hackers
            </p>
            <p className="font-mono text-xs text-gray-700 mt-1">
              Powered by Cloudinary & Next.js
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
