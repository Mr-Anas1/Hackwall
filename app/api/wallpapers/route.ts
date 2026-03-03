import { NextResponse } from 'next/server';
import { Wallpaper } from '@/types';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export const revalidate = 60;
export const runtime = 'nodejs';

type WallpapersCache = {
    ts: number;
    payload: { wallpapers: Wallpaper[] };
};

const CACHE_TTL_MS = 60_000;

const getCache = (): WallpapersCache | null => {
    const g = globalThis as any;
    return g.__hackwall_wallpapers_cache ?? null;
};

const setCache = (value: WallpapersCache) => {
    const g = globalThis as any;
    g.__hackwall_wallpapers_cache = value;
};

export async function GET() {
    try {
        const cached = getCache();
        if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
            return NextResponse.json(cached.payload, {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                    'X-Cache': 'HIT',
                },
            });
        }

        const missing: string[] = [];
        if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

        if (!process.env.CLOUDINARY_CLOUD_NAME && !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            missing.push('CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)');
        }

        console.log('[api/wallpapers] runtime=nodejs');
        console.log('[api/wallpapers] env presence', {
            hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
            hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
            hasCloudName: Boolean(process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
        });

        if (missing.length > 0) {
            console.warn('Missing configuration:', missing.join(', '));
            return NextResponse.json({
                wallpapers: [],
                error: `Missing configuration: ${missing.join(', ')}`,
            });
        }

        const supabaseServer = getSupabaseServerClient();
        const { data, error } = await supabaseServer
            .from('wallpapers')
            .select('id,title,category,cloudinary_public_id,tags,width,height,created_at')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            throw new Error(error.message);
        }

        const wallpapers: Wallpaper[] = (data ?? []).map((row: any) => ({
            id: String(row.id),
            title: row.title ?? 'Untitled Wallpaper',
            category: row.category ?? 'Uncategorized',
            cloudinaryPublicId: row.cloudinary_public_id,
            resolution: row.width && row.height ? `${row.width}x${row.height}` : 'Unknown',
            tags: Array.isArray(row.tags) ? row.tags : [],
            isFavorite: false,
        }));

        const payload = { wallpapers };
        setCache({ ts: Date.now(), payload });

        return NextResponse.json(payload, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                'X-Cache': 'MISS',
            },
        });
    } catch (error) {
        const e = error as any;
        console.error('[api/wallpapers] Failed to fetch wallpapers', {
            message: e?.message,
            name: e?.name,
            code: e?.code,
            errno: e?.errno,
            syscall: e?.syscall,
            address: e?.address,
            port: e?.port,
            cause: e?.cause,
        });
        return NextResponse.json(
            {
                error: 'Failed to fetch wallpapers',
                details: error instanceof Error ? error.message : String(error),
                fullError: error
            },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store',
                    'X-Cache': 'BYPASS',
                },
            }
        );
    }
}
