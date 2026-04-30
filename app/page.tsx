'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CategoryScroll from '@/components/CategoryScroll';
import WallpaperGrid from '@/components/WallpaperGrid';
import WallpaperDetail from '@/components/WallpaperDetail';
import { categories } from '@/data/wallpapers';
import { Wallpaper } from '@/types';
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from '@/lib/storage';
import { useWallpapers } from '@/lib/useWallpapers';
import NativeAdBanner from '@/components/NativeAdBanner';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allFilteredWallpapers, setAllFilteredWallpapers] = useState<Wallpaper[]>([]);
  const [displayedWallpapers, setDisplayedWallpapers] = useState<Wallpaper[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloadQuality, setDownloadQuality] = useState<'hd' | 'original'>('hd');
  const ITEMS_PER_PAGE = 6;

  // Load favorites and download quality from localStorage
  useEffect(() => {
    setFavorites(getFavorites());
    const savedQuality = localStorage.getItem('download_quality') as 'hd' | 'original';
    if (savedQuality) {
      setDownloadQuality(savedQuality);
    }

  }, []);

  const { wallpapers, wallpapersError, isLoading } = useWallpapers();

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter wallpapers based on category and search
  useEffect(() => {
    if (wallpapers.length === 0) return;

    const usableWallpapers = wallpapers.filter(
      (w: Wallpaper) => Boolean(w?.cloudinaryPublicId && String(w.cloudinaryPublicId).trim())
    );

    let filtered = usableWallpapers;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = usableWallpapers.filter((w: Wallpaper) =>
        w.title.toLowerCase().includes(lowerQuery) ||
        w.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)) ||
        w.category.toLowerCase().includes(lowerQuery)
      );
    } else if (selectedCategory) {
      filtered = usableWallpapers.filter((w: Wallpaper) => w.category === selectedCategory);
    }

    // Shuffle the filtered wallpapers
    const shuffled = shuffleArray(filtered);

    setAllFilteredWallpapers(shuffled);
    setPage(1);
    setHasMore(shuffled.length > ITEMS_PER_PAGE);
    setDisplayedWallpapers(shuffled.slice(0, ITEMS_PER_PAGE));
  }, [selectedCategory, searchQuery, wallpapers]);

  // Load more effect tied strictly to page state
  useEffect(() => {
    if (page === 1) return; // page 1 is handled in the filtering effect above
    const endIndex = page * ITEMS_PER_PAGE;
    setDisplayedWallpapers(allFilteredWallpapers.slice(0, endIndex));
    setHasMore(endIndex < allFilteredWallpapers.length);
  }, [page, allFilteredWallpapers]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    
    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setPage((prevPage) => prevPage + 1);
          }, 400);
        }
      },
      { threshold: 0.1 } // Trigger slightly earlier than 1.0 (fully visible)
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasMore, displayedWallpapers.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleToggleFavorite = (wallpaperId: string) => {
    toggleFavoriteStorage(wallpaperId);
    setFavorites(getFavorites());
  };

  return (
    <main className="min-h-screen pt-48">
      <div className="bg-black fixed top-0 left-0 right-0 z-50">

        <Header onSearch={handleSearch} />
        <CategoryScroll
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {wallpapersError && (
        <div className="px-4 pt-4">
          <p className="text-red-400 font-mono text-sm">
            {wallpapersError}
          </p>
        </div>
      )}
      
      {isLoading && displayedWallpapers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4 animate-in fade-in duration-500">
            <div className="w-12 h-12 border-4 border-neon-green/10 border-t-neon-green rounded-full animate-spin shadow-neon"></div>
            <p className="text-neon-green/70 font-mono text-sm mt-6 animate-pulse tracking-widest">
                {'>'} FETCHING_DATA_
            </p>
        </div>
      ) : (
        <WallpaperGrid
          wallpapers={displayedWallpapers}
          favorites={favorites}
          onWallpaperClick={setSelectedWallpaper}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Loading Sentinel / Spinner */}
      {hasMore && displayedWallpapers.length > 0 && (
        <div id="scroll-sentinel" className="flex justify-center p-4 pb-36">
          <div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
        </div>
      )}

      {/* End of list message if we have content but no more to load */}
      {!hasMore && displayedWallpapers.length > 0 && (
        <div className="text-center pb-36 pt-4 text-neon-green/30 font-mono text-xs">
          {'>'} END_OF_LINE_
        </div>
      )}

      <NativeAdBanner hidden={!!selectedWallpaper} />

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
