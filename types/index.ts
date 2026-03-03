export interface Wallpaper {
    id: string;
    title: string;
    category: string;
    cloudinaryPublicId: string;
    tags: string[];
    resolution: string;
    isFavorite?: boolean;
}

export type Category =
    | 'anime'
    | 'character'
    | 'anonymous'
    | 'terminal'
    | 'quote';

export interface CloudinaryConfig {
    cloudName: string;
    baseUrl: string;
}

export type ImageQuality = 'thumbnail' | 'hd' | 'original';
