import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SWRProvider from "@/components/SWRProvider";
import AdMobProvider from "@/components/AdMobProvider";

export const metadata: Metadata = {
  title: "HackWall - Cyberpunk Wallpapers",
  description: "Hacker-style wallpaper app with cyberpunk and terminal aesthetics",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HackWall",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body className="antialiased">
        <SWRProvider>
          <AdMobProvider>
            <div className="min-h-screen bg-cyber-black">
              {children}
              <BottomNav />
            </div>
          </AdMobProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
