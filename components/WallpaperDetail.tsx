'use client';

import { Wallpaper } from '@/types';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface WallpaperDetailProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  downloadQuality: 'hd' | 'original';
}

export default function WallpaperDetail({
  wallpaper,
  isFavorite,
  onClose,
  onToggleFavorite,
  downloadQuality,
}: WallpaperDetailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const hdUrl = getCloudinaryUrl(wallpaper.cloudinaryPublicId, 'hd');
  const fallbackUrl = 'https://placehold.co/1080x1920/1a1a2e/00ff41?text=No+Image';
  const downloadUrl = getCloudinaryUrl(wallpaper.cloudinaryPublicId, downloadQuality);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownload = async () => {
    try {
      if (hasError) {
        alert('Cannot download missing image');
        return;
      }
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hackwall_${wallpaper.id}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HackWall Wallpaper',
          text: 'Check out this wallpaper',
          url: hasError ? window.location.href : hdUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(hasError ? window.location.href : hdUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-neon-green/30 hover:border-neon-green transition-all"
      >
        <svg
          className="w-6 h-6 text-neon-green"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={hasError ? fallbackUrl : hdUrl}
          alt="Wallpaper"
          fill
          unoptimized
          sizes="100vw"
          className={`object-contain transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setHasError(true);
            setImageLoaded(true);
          }}
          priority
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6 pb-8">
        <p className="text-gray-400 font-mono text-sm mb-1">
          Category: {wallpaper.category}
        </p>
        <div className="mb-4" />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {wallpaper.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-cyber-gray border border-neon-green/30 rounded text-neon-green/70 font-mono text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center p-4 bg-neon-green text-black rounded-lg font-mono font-semibold hover:shadow-neon-strong transition-all active:scale-95"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-xs">Download</span>
          </button>

          <button
            onClick={onToggleFavorite}
            className={`flex flex-col items-center justify-center p-4 rounded-lg font-mono font-semibold transition-all active:scale-95 ${
              isFavorite
                ? 'bg-neon-green text-black'
                : 'bg-cyber-gray text-neon-green border border-neon-green/30'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">{isFavorite ? 'Saved' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-4 bg-cyber-gray text-neon-green border border-neon-green/30 rounded-lg font-mono font-semibold hover:border-neon-green transition-all active:scale-95"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-xs">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
