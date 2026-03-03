'use client';

import Image from 'next/image';
import { Wallpaper } from '@/types';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { useEffect, useState } from 'react';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export default function WallpaperCard({
  wallpaper,
  onClick,
  isFavorite,
  onToggleFavorite,
}: WallpaperCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fallbackUrl = 'https://placehold.co/400x600/1a1a2e/00ff41?text=No+Image';

  const thumbnailUrl = wallpaper?.cloudinaryPublicId
    ? getCloudinaryUrl(wallpaper.cloudinaryPublicId, 'thumbnail')
    : fallbackUrl;

  useEffect(() => {
    if (imageLoaded) return;

    const t = setTimeout(() => {
      setHasError(true);
      setImageLoaded(true);
    }, 8000);

    return () => clearTimeout(t);
  }, [imageLoaded]);

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer overflow-hidden rounded-lg border border-cyber-border hover:border-neon-green transition-all duration-300 hover:shadow-neon active:scale-[0.98]"
    >
      {/* Image */}
      <div className="relative aspect-[2/3] bg-cyber-gray">
        <Image
          src={hasError ? fallbackUrl : thumbnailUrl}
          alt="Wallpaper"
          fill
          unoptimized
          sizes="(max-width: 768px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setHasError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-cyber-gray animate-pulse" />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-gray-400 text-xs font-mono mt-1">
              {wallpaper.category}
            </p>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-neon-green/30 hover:border-neon-green transition-all z-10"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'text-neon-green fill-neon-green' : 'text-neon-green/50'
            }`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
