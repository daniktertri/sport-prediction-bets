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
        bg: {
          primary: '#0F0F1A',
          secondary: '#12131A',
          tertiary: '#1A1B26',
        },
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.7)',
          muted: 'rgba(255, 255, 255, 0.5)',
        },
        neon: {
          cyan: '#00E5FF',
          green: '#00FF9D',
          'cyan-dark': '#00B8CC',
          'green-dark': '#00CC7D',
        },
        accent: {
          DEFAULT: '#00E5FF',
          hover: '#00B8CC',
          light: '#33EEFF',
        },
        success: '#00FF9D',
        danger: '#FF4D4D',
        warning: '#FFB84D',
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.4), 0 0 40px rgba(0, 229, 255, 0.2)',
        'neon-green': '0 0 20px rgba(0, 255, 157, 0.4), 0 0 40px rgba(0, 255, 157, 0.2)',
        'neon-cyan-sm': '0 0 10px rgba(0, 229, 255, 0.3)',
        'neon-green-sm': '0 0 10px rgba(0, 255, 157, 0.3)',
        'glow': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 229, 255, 0.1)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
