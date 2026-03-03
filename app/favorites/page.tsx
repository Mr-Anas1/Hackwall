'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WallpaperGrid from '@/components/WallpaperGrid';
import WallpaperDetail from '@/components/WallpaperDetail';
import { Wallpaper } from '@/types';
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from '@/lib/storage';
import { useWallpapers } from '@/lib/useWallpapers';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteWallpapers, setFavoriteWallpapers] = useState<Wallpaper[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [downloadQuality, setDownloadQuality] = useState<'hd' | 'original'>('hd');
  const { wallpapers, wallpapersError } = useWallpapers();

  useEffect(() => {
    const favIds = getFavorites();
    setFavorites(favIds);

    const savedQuality = localStorage.getItem('download_quality') as 'hd' | 'original';
    if (savedQuality) {
      setDownloadQuality(savedQuality);
    }
  }, []);

  useEffect(() => {
    setFavoriteWallpapers(wallpapers.filter((w: Wallpaper) => favorites.includes(w.id)));
  }, [wallpapers, favorites]);

  const handleToggleFavorite = (wallpaperId: string) => {
    toggleFavoriteStorage(wallpaperId);
    const updatedFavorites = getFavorites();
    setFavorites(updatedFavorites);
    setFavoriteWallpapers((current) => current.filter((w) => updatedFavorites.includes(w.id)));
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="p-4">
        <h1 className="text-2xl font-cyber text-neon-green mb-2">
          {'>'} Favorites_
        </h1>
        <p className="text-gray-400 font-mono text-sm mb-6">
          {favoriteWallpapers.length} wallpaper{favoriteWallpapers.length !== 1 ? 's' : ''} saved
        </p>
        {wallpapersError && (
          <p className="text-red-400 font-mono text-sm">
            {wallpapersError}
          </p>
        )}
      </div>

      {favoriteWallpapers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4">💚</div>
          <p className="text-neon-green/70 font-mono text-center text-lg mb-2">
            No favorites yet
          </p>
          <p className="text-gray-500 font-mono text-sm text-center">
            Start adding wallpapers to your favorites!
          </p>
        </div>
      ) : (
        <WallpaperGrid
          wallpapers={favoriteWallpapers}
          favorites={favorites}
          onWallpaperClick={setSelectedWallpaper}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {selectedWallpaper && (
        <WallpaperDetail
          wallpaper={selectedWallpaper}
          isFavorite={favorites.includes(selectedWallpaper.id)}
          onClose={() => setSelectedWallpaper(null)}
          onToggleFavorite={() => {
            handleToggleFavorite(selectedWallpaper.id);
          }}
          downloadQuality={downloadQuality}
        />
      )}
    </main>
  );
}
