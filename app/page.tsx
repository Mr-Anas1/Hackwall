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

  const { wallpapers, wallpapersError } = useWallpapers();

  // Filter wallpapers based on category and search
  useEffect(() => {
    // If wallpapers state is empty (initial load), don't filter yet
    if (wallpapers.length === 0) return;

    // Guard: exclude rows that can't render an image so infinite-scroll math stays correct
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

    setAllFilteredWallpapers(filtered);
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
    setDisplayedWallpapers(filtered.slice(0, ITEMS_PER_PAGE));
  }, [selectedCategory, searchQuery, wallpapers]);

  // Load more wallpapers
  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    const newWallpapers = allFilteredWallpapers.slice(0, endIndex);
    
    setDisplayedWallpapers(newWallpapers);
    setPage(nextPage);
    setHasMore(endIndex < allFilteredWallpapers.length);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Add a small delay for realistic loading feel
          setTimeout(() => {
            loadMore();
          }, 500);
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, page, allFilteredWallpapers]);

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
    <main className="min-h-screen">
      <Header onSearch={handleSearch} />
      <CategoryScroll
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      {wallpapersError && (
        <div className="px-4 pt-4">
          <p className="text-red-400 font-mono text-sm">
            {wallpapersError}
          </p>
        </div>
      )}
      <WallpaperGrid
        wallpapers={displayedWallpapers}
        favorites={favorites}
        onWallpaperClick={setSelectedWallpaper}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Loading Sentinel / Spinner */}
      {hasMore && (
        <div id="scroll-sentinel" className="flex justify-center p-4 pb-20">
          <div className="w-8 h-8 border-2 border-neon-green/30 border-t-neon-green rounded-full animate-spin"></div>
        </div>
      )}

      {/* End of list message if we have content but no more to load */}
      {!hasMore && displayedWallpapers.length > 0 && (
        <div className="text-center pb-24 pt-4 text-neon-green/30 font-mono text-xs">
          {'>'} END_OF_LINE_
        </div>
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
