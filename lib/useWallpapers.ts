'use client';

import useSWR from 'swr';
import { Wallpaper } from '@/types';

type WallpapersResponse = {
    wallpapers: Wallpaper[];
    error?: string | null;
    details?: string;
};

const fetcher = async (url: string): Promise<WallpapersResponse> => {
    const res = await fetch(url);
    const raw = await res.text();

    let data: any = null;
    try {
        data = raw ? JSON.parse(raw) : null;
    } catch {
        data = null;
    }

    if (!res.ok) {
        const msg = data?.error || data?.details || raw || `Request failed (${res.status})`;
        throw new Error(String(msg));
    }

    return {
        wallpapers: Array.isArray(data?.wallpapers) ? data.wallpapers : [],
        error: data?.error ?? null,
        details: data?.details,
    };
};

const EMPTY_WALLPAPERS: Wallpaper[] = [];

export const useWallpapers = () => {
    const { data, error, isLoading, isValidating, mutate } = useSWR<WallpapersResponse>(
        '/api/wallpapers',
        fetcher,
        {
            // If you navigate back to the page quickly, don't revalidate immediately.
            revalidateIfStale: false,
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
