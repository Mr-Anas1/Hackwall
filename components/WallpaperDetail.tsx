'use client';

import { Wallpaper } from '@/types';
import { getCloudinaryDownloadUrl, getCloudinaryUrl } from '@/lib/cloudinary';
import { maybeShowInterstitialAfterDownload } from '@/lib/admob';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const toSafeFilenamePart = (value: string) =>
    value
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-]+/g, '')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 60);

  const hdUrl = getCloudinaryUrl(wallpaper.cloudinaryPublicId, 'hd');
  const fallbackUrl = 'https://placehold.co/1080x1920/1a1a2e/00ff41?text=No+Image';
  const downloadUrl =
    downloadQuality === 'original'
      ? getCloudinaryDownloadUrl(wallpaper.cloudinaryPublicId, { format: 'png', maxWidth: 4096 })
      : getCloudinaryDownloadUrl(wallpaper.cloudinaryPublicId, { format: 'png', maxWidth: 2160 });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const backHandler = App.addListener('backButton', () => onClose());
    return () => {
      document.body.style.overflow = 'unset';
      backHandler.then((h) => h.remove());
    };
  }, [onClose]);

  const handleDownload = async () => {
    try {
      if (hasError) {
        setToast({ message: 'Cannot download missing image', type: 'error' });
        return;
      }
      setIsDownloading(true);
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const titlePartRaw = wallpaper.title ? String(wallpaper.title).trim() : '';
        const titlePart =
          titlePartRaw && titlePartRaw.toLowerCase() !== 'untitled wallpaper'
            ? toSafeFilenamePart(titlePartRaw)
            : '';
        const categoryPart = wallpaper.category ? toSafeFilenamePart(String(wallpaper.category)) : '';
        const idPart = toSafeFilenamePart(String(wallpaper.id));
        const baseName =
          titlePart
            ? `HackWall_${titlePart}`
            : categoryPart
              ? `HackWall_${categoryPart}`
              : `HackWall_${idPart}`;
        const fileName = `${baseName}_${downloadQuality}.png`;
        const { Capacitor } = await import('@capacitor/core');

        if (Capacitor.isNativePlatform()) {
          try {
            await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Documents,
            });
            maybeShowInterstitialAfterDownload();
            setToast({ message: `Saved to Documents/${fileName}`, type: 'success' });
          } catch {
            const writeRes = await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Cache,
            });
            await Share.share({ title: 'HackWall', url: writeRes.uri });
            setToast({ message: 'Saved. Choose where to store it', type: 'success' });
            maybeShowInterstitialAfterDownload();
          }
        } else {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          setToast({ message: 'Download started', type: 'success' });
        }
      };
    } catch {
      setToast({ message: 'Download failed', type: 'error' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (hasError) {
        setToast({ message: 'Cannot share missing image', type: 'error' });
        return;
      }

      const shareUrl = downloadQuality === 'original'
        ? getCloudinaryDownloadUrl(wallpaper.cloudinaryPublicId, { format: 'png', maxWidth: 4096 })
        : getCloudinaryDownloadUrl(wallpaper.cloudinaryPublicId, { format: 'png', maxWidth: 2160 });

      const response = await fetch(shareUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const titlePartRaw = wallpaper.title ? String(wallpaper.title).trim() : '';
        const titlePart =
          titlePartRaw && titlePartRaw.toLowerCase() !== 'untitled wallpaper'
            ? toSafeFilenamePart(titlePartRaw)
            : '';
        const categoryPart = wallpaper.category ? toSafeFilenamePart(String(wallpaper.category)) : '';
        const idPart = toSafeFilenamePart(String(wallpaper.id));
        const baseName =
          titlePart
            ? `HackWall_${titlePart}`
            : categoryPart
              ? `HackWall_${categoryPart}`
              : `HackWall_${idPart}`;
        const fileName = `${baseName}_${downloadQuality}.png`;
        const { Capacitor } = await import('@capacitor/core');

        if (Capacitor.isNativePlatform()) {
          const writeRes = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          const shareText = wallpaper.title && wallpaper.title.toLowerCase() !== 'untitled wallpaper'
            ? `Check out this wallpaper: ${wallpaper.title}`
            : 'Check out this wallpaper';
          await Share.share({
            title: 'HackWall Wallpaper',
            text: shareText,
            url: writeRes.uri,
          });
          setToast({ message: 'Image shared successfully', type: 'success' });
        } else if (navigator.share) {
          const url = window.URL.createObjectURL(blob);
          const file = new File([blob], fileName, { type: 'image/png' });
          const shareText = wallpaper.title && wallpaper.title.toLowerCase() !== 'untitled wallpaper'
            ? `Check out this wallpaper: ${wallpaper.title}`
            : 'Check out this wallpaper';
          await navigator.share({
            title: 'HackWall Wallpaper',
            text: shareText,
            files: [file],
          });
          window.URL.revokeObjectURL(url);
          setToast({ message: 'Image shared successfully', type: 'success' });
        } else {
          navigator.clipboard.writeText(hdUrl);
          alert('Link copied!');
        }
      };
    } catch {
      setToast({ message: 'Share failed', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      {/* 1. Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-neon-green/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-neon-green/10 blur-[120px] rounded-full" />
      </div>

      {/* 2. Top Navigation Bar */}
      <div 
        className="relative z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <div className="flex flex-col">
          <h2 className="text-neon-green font-mono text-xs tracking-widest uppercase">System.Details</h2>
          <span className="text-white/50 text-[10px] font-mono">ID: {wallpaper.id.slice(0, 8)}...</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-neon-green/50 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 3. Main Image Container */}
      <div className="relative flex-1 w-full flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/5">
          <Image
            src={hasError ? fallbackUrl : hdUrl}
            alt="Wallpaper"
            fill
            unoptimized
            className={`object-cover transition-all duration-700 ${
              imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setHasError(true)}
            priority
          />
          
          {/* Loading Overlay */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyber-gray/20 backdrop-blur-md">
              <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-neon-green font-mono text-[10px] animate-pulse">INITIALIZING_STREAM...</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Info Panel */}
      <div className="relative z-10 px-6 pt-6 pb-10 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="max-w-md mx-auto">
          {/* Category & Tags */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-neon-green/50 uppercase mb-1">Source_Node</span>
              <span className="text-white font-mono text-sm">{wallpaper.category}</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex-[2] overflow-x-auto no-scrollbar">
              <span className="block text-[10px] font-mono text-neon-green/50 uppercase mb-1">Encrypted_Tags</span>
              <div className="flex gap-2">
                {wallpaper.tags.map((tag) => (
                  <span key={tag} className="text-white/60 font-mono text-xs whitespace-nowrap">#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="col-span-2 flex items-center justify-center gap-3 py-4 bg-neon-green text-black rounded-2xl font-mono font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>DOWNLOAD</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleFavorite}
              className={`flex flex-col items-center justify-center rounded-2xl border transition-all active:scale-95 ${
                isFavorite 
                  ? 'bg-red-500/10 border-red-500 text-red-500' 
                  : 'bg-white/5 border-white/10 text-white hover:border-white/30'
              }`}
            >
              <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center bg-white/5 border border-white/10 text-white rounded-2xl hover:border-white/30 transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-[120] px-4">
          <div
            className={
              `flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md font-mono text-xs ` +
              (toast.type === 'success'
                ? 'bg-neon-green/10 border-neon-green/40 text-neon-green'
                : 'bg-red-500/10 border-red-500/40 text-red-400')
            }
          >
            <div
              className={
                `w-2 h-2 rounded-full ` +
                (toast.type === 'success' ? 'bg-neon-green' : 'bg-red-400')
              }
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}