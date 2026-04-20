import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hackwall.app',
  appName: 'HackWall',
  webDir: 'out',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-6388743721359867~3628688199',
      initializeForTesting: true,
    }
  }
};

export default config;
