'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function ProfilePage() {
  const [theme, setTheme] = useState<'dark' | 'extra-dark'>('dark');
  const [downloadQuality, setDownloadQuality] = useState<'hd' | 'original'>('hd');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'extra-dark';
    const savedQuality = localStorage.getItem('download_quality') as 'hd' | 'original';
    
    if (savedTheme) handleThemeChange(savedTheme);
    if (savedQuality) setDownloadQuality(savedQuality);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'extra-dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'extra-dark') {
      document.documentElement.style.setProperty('--cyber-black', '#000000');
      document.documentElement.style.setProperty('--cyber-gray', '#050505');
    } else {
      document.documentElement.style.setProperty('--cyber-black', '#080808');
      document.documentElement.style.setProperty('--cyber-gray', '#121212');
    }
  };

  const handleQualityChange = (quality: 'hd' | 'original') => {
    setDownloadQuality(quality);
    localStorage.setItem('download_quality', quality);
  };

  const handleClearCache = () => {
    alert("Local cache cleared successfully.");
  };

  return (
    <main className="min-h-screen pb-24 bg-cyber-black text-white selection:bg-neon-green/30 transition-colors duration-300">
      <Header />
      
      <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-8 px-2 mt-4">
          <div className="w-12 h-12 rounded-full border border-neon-green/30 flex items-center justify-center overflow-hidden bg-cyber-gray/50">
            <svg className="w-6 h-6 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-cyber text-neon-green tracking-wider">
              PROFILE
            </h1>
            <p className="text-xs text-gray-500 font-mono">Manage application settings</p>
          </div>
        </div>

        {/* Settings Group */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-4 mb-2">Display Mode</h2>
            <div className="bg-cyber-gray/30 rounded-2xl overflow-hidden border border-neon-green/10 backdrop-blur-sm">
              
              <button
                onClick={() => handleThemeChange('dark')}
                className="w-full relative flex items-center justify-between p-4 border-b border-neon-green/10 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-200">Standard Dark</p>
                    <p className="text-xs text-gray-500">Perfect balance for viewing</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${theme === 'dark' ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'}`}>
                  {theme === 'dark' && <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />}
                </div>
              </button>

              <button
                onClick={() => handleThemeChange('extra-dark')}
                className="w-full relative flex items-center justify-between p-4 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-gray-900">
                    <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-200">OLED Pitch Black</p>
                    <p className="text-xs text-gray-500">Saves battery on OLED screens</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${theme === 'extra-dark' ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'}`}>
                   {theme === 'extra-dark' && <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />}
                </div>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-4 mb-2">Media Settings</h2>
            <div className="bg-cyber-gray/30 rounded-2xl overflow-hidden border border-neon-green/10 backdrop-blur-sm">
              <button
                onClick={() => handleQualityChange('hd')}
                className="w-full relative flex items-center justify-between p-4 border-b border-neon-green/10 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                    <span className="font-mono text-xs font-bold text-gray-300">HD</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-200">High Definition</p>
                    <p className="text-xs text-gray-500">Fast downloads, mobile optimized</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${downloadQuality === 'hd' ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'}`}>
                   {downloadQuality === 'hd' && <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />}
                </div>
              </button>

              <button
                onClick={() => handleQualityChange('original')}
                className="w-full relative flex items-center justify-between p-4 border-b border-neon-green/10 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                    <span className="font-mono text-xs font-bold text-neon-green">4K</span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-200">Original Quality</p>
                    <p className="text-xs text-gray-500">Uncompressed pure quality</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${downloadQuality === 'original' ? 'border-neon-green bg-neon-green/20' : 'border-gray-600'}`}>
                   {downloadQuality === 'original' && <div className="w-2.5 h-2.5 rounded-full bg-neon-green" />}
                </div>
              </button>
              
              <button
                onClick={handleClearCache}
                className="w-full relative flex items-center justify-between p-4 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm text-gray-200">Clear Image Cache</p>
                    <p className="text-xs text-gray-500">Free up local device storage</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-4 mb-2">About App</h2>
            <div className="bg-cyber-gray/30 rounded-2xl overflow-hidden border border-neon-green/10 backdrop-blur-sm">
              <a href="mailto:tensolab.official@gmail.com" className="w-full flex items-center justify-between p-4 border-b border-neon-green/10 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors">
                <span className="font-medium text-sm text-gray-200">Contact Support</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <Link href="/terms" className="w-full flex items-center justify-between p-4 border-b border-neon-green/10 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors">
                <span className="font-medium text-sm text-gray-200">Terms & Conditions</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/privacy" className="w-full flex items-center justify-between p-4 border-b border-neon-green/10 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors">
                <span className="font-medium text-sm text-gray-200">Privacy Policy</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/about" className="w-full flex items-center justify-between p-4 hover:bg-neon-green/5 active:bg-neon-green/10 transition-colors">
                <span className="font-medium text-sm text-gray-200">About HackWall</span>
                <span className="font-mono text-xs text-gray-500 mr-2">v1.2.0</span>
              </Link>
            </div>
          </section>

        </div>
        
        {/* Copyright */}
        <div className="mt-12 mb-6 text-center">
          <p className="font-mono text-xs text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Tensolab.
          </p>
          <p className="font-mono text-[10px] text-gray-700 mt-1 uppercase tracking-widest">
            All Rights Reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
