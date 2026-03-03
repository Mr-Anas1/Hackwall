# 🖤 HackWall - Cyberpunk Wallpaper App

A mobile-first Next.js 14 wallpaper application with a hacker/cyberpunk aesthetic. Features terminal-style UI, neon green accents, and smooth animations.

## ✨ Features

- 📱 **Mobile-First Design** - Optimized 2-column grid layout
- 🎨 **Cyberpunk Aesthetic** - Dark theme with neon green accents
- 🔍 **Search & Filter** - Search wallpapers and filter by category
- ❤️ **Favorites** - Save wallpapers locally
- 📥 **Download** - HD and Original quality options
- 🔗 **Share** - Native share functionality
- ⚡ **PWA Ready** - Installable as a mobile app
- 🖼️ **Cloudinary Integration** - Optimized image delivery
- 🎯 **TypeScript** - Full type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Cloudinary account (free tier works)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Cloudinary:**
   - Create a free account at [cloudinary.com](https://cloudinary.com)
   - Copy your Cloud Name
   - Update `.env.local`:
     ```
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
     ```

3. **Add your wallpapers:**
   - Upload images to your Cloudinary account
   - Update `data/wallpapers.ts` with your image public IDs

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📂 Project Structure

```
hackwall/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout with bottom nav
│   ├── page.tsx           # Home page
│   ├── favorites/         # Favorites page
│   └── profile/           # Settings page
├── components/            # React components
│   ├── Header.tsx         # Top header with search
│   ├── BottomNav.tsx      # Bottom tab navigation
│   ├── CategoryScroll.tsx # Category filter
│   ├── WallpaperCard.tsx  # Grid item
│   ├── WallpaperGrid.tsx  # Grid layout
│   └── WallpaperDetail.tsx # Full-screen modal
├── data/                  # Mock data
│   └── wallpapers.ts      # Wallpaper data
├── lib/                   # Utilities
│   ├── cloudinary.ts      # Image URL generation
│   └── storage.ts         # LocalStorage helpers
├── types/                 # TypeScript types
│   └── index.ts
└── public/                # Static assets
    └── manifest.json      # PWA manifest
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
colors: {
  'cyber-black': '#000000',
  'neon-green': '#00FF41',
  'dark-purple': '#1A1A2E',
  // Add your colors...
}
```

### Categories

Update categories in `data/wallpapers.ts`:

```typescript
export const categories: Category[] = [
  'Cyberpunk',
  'Matrix',
  // Add your categories...
];
```

## 🖼️ Adding Wallpapers

1. Upload images to Cloudinary
2. Get the public ID (e.g., `samples/landscapes/architecture-signs`)
3. Add to `data/wallpapers.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Your Title',
  category: 'Cyberpunk',
  cloudinaryPublicId: 'your/public/id',
  tags: ['tag1', 'tag2'],
  resolution: '1080x1920',
}
```

## 📱 PWA Setup

The app is PWA-ready! To enable:

1. Create app icons (192x192 and 512x512)
2. Place in `public/` folder
3. Build for production: `npm run build`
4. Deploy to HTTPS domain
5. Users can "Add to Home Screen"

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `demo` |

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Other Platforms

1. Build: `npm run build`
2. Start: `npm start`
3. Ensure environment variables are set

## 🎯 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Images:** Cloudinary
- **PWA:** next-pwa
- **Storage:** LocalStorage

## 📝 License

MIT License - feel free to use for your own projects!

## 🤝 Contributing

Contributions welcome! Feel free to open issues or PRs.

## 💚 Made with

Built with Antigravity UI principles - dark, minimal, hacker vibes.

---

**Happy Hacking! 🖤💚**
