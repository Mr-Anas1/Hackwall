import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    api_proxy: process.env.HTTPS_PROXY || process.env.HTTP_PROXY,
    timeout: 60000,
});

export default cloudinary;
