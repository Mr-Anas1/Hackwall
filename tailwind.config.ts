import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-black': 'var(--cyber-black)',
                'neon-green': 'var(--neon-green)',
                'dark-purple': 'var(--dark-purple)',
                'cyber-gray': 'var(--cyber-gray)',
                'cyber-border': 'var(--cyber-border)',
            },
            fontFamily: {
                mono: ['Courier New', 'monospace'],
                'cyber': ['Share Tech Mono', 'monospace'],
            },
            boxShadow: {
                'neon': '0 0 10px rgba(0, 255, 65, 0.5)',
                'neon-strong': '0 0 20px rgba(0, 255, 65, 0.8)',
                'purple-glow': '0 0 15px rgba(26, 26, 46, 0.6)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scan': 'scan 2s linear infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.8)' },
                },
                scan: {
                    '0%, 100%': { transform: 'translateX(-100%)', opacity: '0' },
                    '50%': { transform: 'translateX(100%)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
