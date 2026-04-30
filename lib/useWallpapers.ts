'use client';

import useSWR from 'swr';
import { Wallpaper } from '@/types';
import { getSupabaseClient } from '@/lib/supabase-client';

type WallpapersResponse = {
    wallpapers: Wallpaper[];
    error?: string | null;
};

const fetcher = async (): Promise<WallpapersResponse> => {
    console.log('[useWallpapers] Fetching wallpapers...');
    try {
        const supabase = getSupabaseClient();
        console.log('[useWallpapers] Supabase client created');
        const { data, error } = await supabase
            .from('wallpapers')
            .select('id,title,category,cloudinary_public_id,tags,width,height,created_at')
            .order('created_at', { ascending: false })
            .limit(100);

        console.log('[useWallpapers] Query result:', { data, error });

        if (error) {
            throw new Error(error.message);
        }

        const wallpapers: Wallpaper[] = (data ?? []).map((row: {
            id: string | number;
            title?: string | null;
            category?: string | null;
            cloudinary_public_id: string;
            tags?: unknown;
            width?: number | null;
            height?: number | null;
        }) => ({
            id: String(row.id),
            title: row.title ?? 'Untitled Wallpaper',
            category: row.category ?? 'Uncategorized',
            cloudinaryPublicId: row.cloudinary_public_id,
            resolution: row.width && row.height ? `${row.width}x${row.height}` : 'Unknown',
            tags: Array.isArray(row.tags) ? row.tags : [],
            isFavorite: false,
        }));

        console.log('[useWallpapers] Mapped wallpapers:', wallpapers.length);
        return { wallpapers };
    } catch (error) {
        console.error('[useWallpapers] Failed to fetch wallpapers:', error);
        return {
            wallpapers: [],
            error: error instanceof Error ? error.message : 'Failed to fetch wallpapers',
        };
    }
};

const EMPTY_WALLPAPERS: Wallpaper[] = [];

export const useWallpapers = () => {
    const { data, error, isLoading, isValidating, mutate } = useSWR<WallpapersResponse>(
        'wallpapers',
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnMount: true,
        }
    );

    return {
        wallpapers: data?.wallpapers ?? EMPTY_WALLPAPERS,
        wallpapersError: (data?.error ?? null) || (error ? error.message : null),
        isLoading,
        isValidating,
        mutate,
    };
};
