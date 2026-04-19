
const FAVORITES_KEY = 'hackwall_favorites';

export const getFavorites = (): string[] => {
    if (typeof window === 'undefined') return [];
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
};

export const addFavorite = (wallpaperId: string): void => {
    const favorites = getFavorites();
    if (!favorites.includes(wallpaperId)) {
        favorites.push(wallpaperId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
};

export const removeFavorite = (wallpaperId: string): void => {
    const favorites = getFavorites();
    const updated = favorites.filter(id => id !== wallpaperId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const isFavorite = (wallpaperId: string): boolean => {
    const favorites = getFavorites();
    return favorites.includes(wallpaperId);
};

export const toggleFavorite = (wallpaperId: string): boolean => {
    if (isFavorite(wallpaperId)) {
        removeFavorite(wallpaperId);
        return false;
    } else {
        addFavorite(wallpaperId);
        return true;
    }
};
