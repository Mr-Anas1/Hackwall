import { Wallpaper, Category } from '@/types';

// Mock wallpaper data - Replace cloudinaryPublicId with your actual Cloudinary public IDs
export const mockWallpapers: Wallpaper[] = [
    // Cyberpunk
    {
        id: '1',
        title: 'User Upload Example',
        category: 'Cyberpunk',
        cloudinaryPublicId: '45_ewvmnv', // Your uploaded image!
        tags: ['user', 'upload', 'custom'],
        resolution: 'Unknown',
    },
    {
        id: '2',
        title: 'Cyber Street',
        category: 'Cyberpunk',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop', // Code rain
        tags: ['street', 'neon', 'urban', 'code'],
        resolution: '4K',
    },
    {
        id: '3',
        title: 'Digital Rain',
        category: 'Cyberpunk',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop', // Matrix style
        tags: ['digital', 'rain', 'code'],
        resolution: '4K',
    },
    // Matrix
    {
        id: '4',
        title: 'Green Code',
        category: 'Matrix',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop', // Matrix code
        tags: ['matrix', 'code', 'green'],
        resolution: '4K',
    },
    {
        id: '5',
        title: 'Binary World',
        category: 'Matrix',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop', // Tech texture
        tags: ['binary', 'matrix', 'digital'],
        resolution: '4K',
    },
    {
        id: '6',
        title: 'Code Flow',
        category: 'Matrix',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1558494949-ef526b01201b?auto=format&fit=crop', // Server lights
        tags: ['code', 'flow', 'matrix'],
        resolution: '4K',
    },
    // Anonymous
    {
        id: '7',
        title: 'Hacker Mask',
        category: 'Anonymous',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop', // Reusing matrix for anon feel
        tags: ['anonymous', 'mask', 'hacker'],
        resolution: '4K', // Note: Unsplash has specific copyright on exact Fawkes masks, using generic hacker vibes
    },
    {
        id: '8',
        title: 'Digital Anonymous',
        category: 'Anonymous',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd82?auto=format&fit=crop', // Hoodie figure
        tags: ['anonymous', 'digital', 'hacker'],
        resolution: '4K',
    },
    // Terminal
    {
        id: '9',
        title: 'Terminal Dark',
        category: 'Terminal',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop', // Screen code
        tags: ['terminal', 'dark', 'code'],
        resolution: 'HD',
    },
    {
        id: '10',
        title: 'Command Line',
        category: 'Terminal',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop', // Coding screen
        tags: ['terminal', 'command', 'code'],
        resolution: 'HD',
    },
    // AI
    {
        id: '11',
        title: 'Neural Network',
        category: 'AI',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1507146153580-69a196bb5342?auto=format&fit=crop', // Network nodes
        tags: ['ai', 'neural', 'network'],
        resolution: '8K',
    },
    {
        id: '12',
        title: 'AI Brain',
        category: 'AI',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop', // AI blue
        tags: ['ai', 'brain', 'digital'],
        resolution: '4K',
    },
    // Characters
    {
        id: '13',
        title: 'Cyber Warrior',
        category: 'Characters',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop', // Abstract figure
        tags: ['character', 'warrior', 'cyber'],
        resolution: '4K',
    },
    {
        id: '14',
        title: 'Hacker Girl',
        category: 'Characters',
        cloudinaryPublicId: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop', // Tech glasses
        tags: ['character', 'hacker', 'girl'],
        resolution: '4K',
    },
];

export const categories: Category[] = [
    'anime',
    'character',
    'anonymous',
    'terminal',
    'quote',
];

export const getWallpapersByCategory = (category: string): Wallpaper[] => {
    return mockWallpapers.filter(w => w.category === category);
};

export const searchWallpapers = (query: string): Wallpaper[] => {
    const lowerQuery = query.toLowerCase();
    return mockWallpapers.filter(
        w =>
            w.title.toLowerCase().includes(lowerQuery) ||
            w.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            w.category.toLowerCase().includes(lowerQuery)
    );
};
