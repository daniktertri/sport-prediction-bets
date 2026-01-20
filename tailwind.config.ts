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
          primary: '#000000',
          secondary: 'rgba(255, 255, 255, 0.08)',
          tertiary: 'rgba(255, 255, 255, 0.12)',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
          muted: 'rgba(255, 255, 255, 0.5)',
        },
        accent: {
          DEFAULT: '#007AFF',
          hover: '#0051D5',
          light: '#5AC8FA',
        },
        success: '#34C759',
        danger: '#FF3B30',
        warning: '#FF9500',
        purple: '#AF52DE',
        pink: '#FF2D55',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 20px 60px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
