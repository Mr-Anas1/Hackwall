import { ImageQuality } from '@/types';

// Replace with your Cloudinary cloud name
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

const normalizeCloudinaryPublicId = (publicId: string): string => {
    let normalized = publicId.trim();

    // If someone accidentally stored a full Cloudinary delivery URL, extract the public_id portion.
    const uploadMarker = '/image/upload/';
    const uploadIndex = normalized.indexOf(uploadMarker);
    if (uploadIndex !== -1) {
        normalized = normalized.slice(uploadIndex + uploadMarker.length);
        // Drop any transformations/version segments if present (best-effort)
        // Common shapes: w_100/.../v123/folder/name or v123/folder/name
        const parts = normalized.split('/');
        const vIndex = parts.findIndex((p) => /^v\d+$/.test(p));
        if (vIndex !== -1) {
            normalized = parts.slice(vIndex + 1).join('/');
        } else {
            // If no version, keep as-is (it might already start with folder/name)
            normalized = parts.join('/');
        }
    }

    // Cloudinary public_id should not start with '/'
    normalized = normalized.replace(/^\/+/, '');

    // In Cloudinary, public_id typically excludes the file extension.
    // If an extension was included, strip it.
    normalized = normalized.replace(/\.(png|jpe?g|webp|gif|bmp|tiff?|svg)$/i, '');

    return normalized;
};

const encodePublicIdPreservingSlashes = (publicId: string): string => {
    // Important: encode each segment, but keep '/' intact for folder paths.
    return publicId
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
};

export const getCloudinaryUrl = (
    publicId: string,
    quality: ImageQuality = 'thumbnail'
): string => {
    // If publicId is already a full URL (e.g. from Unsplash), return it with mock params.
    // If it's a Cloudinary delivery URL, extract the underlying public_id so we can apply transformations.
    if (publicId.startsWith('http')) {
        if (publicId.includes('unsplash.com')) {
            const width = quality === 'thumbnail' ? 400 : quality === 'hd' ? 1080 : 1920;
            const separator = publicId.includes('?') ? '&' : '?';
            return `${publicId}${separator}w=${width}&q=80`;
        }

        if (publicId.includes('res.cloudinary.com') && publicId.includes('/image/upload/')) {
            const normalizedFromUrl = normalizeCloudinaryPublicId(publicId);
            const encodedFromUrl = encodePublicIdPreservingSlashes(normalizedFromUrl);

            const transformations = {
                // Grid: small thumbnails for fast loading (target 300–500px width)
                thumbnail: 'w_450,c_fill,f_webp,q_auto:eco',

                // Detail: medium resolution (1080px)
                hd: 'w_1080,c_limit,f_webp,q_auto:good',

                // Download: 4K target, but do not upscale beyond original
                original: 'w_2160,c_limit,f_webp,q_auto:best',
            };

            const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
            const transform = transformations[quality];
            return `${baseUrl}/${transform}/${encodedFromUrl}`;
        }

        return publicId;
    }

    const transformations = {
        // Grid: small thumbnails for fast loading (target 300–500px width)
        thumbnail: 'w_450,c_fill,f_webp,q_auto:eco',

        // Detail: medium resolution (1080px)
        hd: 'w_1080,c_limit,f_webp,q_auto:good',

        // Download: 4K target, but do not upscale beyond original
        original: 'w_2160,c_limit,f_webp,q_auto:best',
    };

    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const transform = transformations[quality];
    const normalizedPublicId = normalizeCloudinaryPublicId(publicId);
    const encodedPublicId = encodePublicIdPreservingSlashes(normalizedPublicId);
    return `${baseUrl}/${transform}/${encodedPublicId}`;
};

export const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
    });
};
