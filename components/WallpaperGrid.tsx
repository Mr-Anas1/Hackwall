'use client';

import { Wallpaper } from '@/types';
import WallpaperCard from './WallpaperCard';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  favorites: string[];
  onWallpaperClick: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (wallpaperId: string) => void;
}

export default function WallpaperGrid({
  wallpapers,
  favorites,
  onWallpaperClick,
  onToggleFavorite,
}: WallpaperGridProps) {
  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-neon-green/70 font-mono text-center">
          No wallpapers found
        </p>
        <p className="text-gray-500 font-mono text-sm mt-2 text-center">
          Try a different search or category
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 pb-36">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          onClick={() => onWallpaperClick(wallpaper)}
          isFavorite={favorites.includes(wallpaper.id)}
          onToggleFavorite={(e) => {
            e.stopPropagation();
            onToggleFavorite(wallpaper.id);
          }}
        />
      ))}
    </div>
  );
}
