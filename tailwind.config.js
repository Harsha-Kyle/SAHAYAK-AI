/**
 * Cooperative Sahayak — design tokens.
 * This file is the single source of truth for colour, type, spacing, radius,
 * elevation and motion. Components reference these tokens by name only.
 */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // India Green — primary brand, headers, success / verified (~50%)
        brand: { DEFAULT: '#138808', dark: '#0D6B05', tint: '#E8F4E6' },
        // Saffron — primary CTA, mic, active highlight (~15%). Always pair with ink text.
        saffron: { DEFAULT: '#FF9933', dark: '#E8811C', tint: '#FFF2E3' },
        // Navy (Ashoka Chakra) — links, icons, focus rings (~5%)
        navy: { DEFAULT: '#000080', tint: '#EEEEF8' },
        // White surfaces (~30%)
        paper: '#FFFFFF',
        surface: '#F5F5F5',
        line: '#E0E0E0',
        muted: '#4A4A4A',
        ink: '#1A1A1A',
        danger: { DEFAULT: '#B3261E', tint: '#FCEBEA' },
      },
      fontFamily: {
        sans: [
          '"Noto Sans"',
          '"Noto Sans Devanagari"',
          '"Noto Sans Tamil"',
          '"Noto Sans Telugu"',
          '"Noto Sans Kannada"',
          '"Noto Sans Malayalam"',
          '"Noto Sans Bengali"',
          'system-ui',
          'sans-serif',
        ],
      },
      // Type scale 32 / 24 / 18 / 16 / 14 (px at 16px root). Body never below 16.
      fontSize: {
        display: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        title: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        body: ['1.125rem', { lineHeight: '1.75rem' }],
        small: ['1rem', { lineHeight: '1.5rem' }],
        caption: ['0.875rem', { lineHeight: '1.25rem' }],
      },
      spacing: { tap: '3.5rem', 'tap-lg': '4.5rem' },
      minHeight: { tap: '3.5rem', 'tap-lg': '4.5rem' },
      minWidth: { tap: '3.5rem', 'tap-lg': '4.5rem' },
      borderRadius: { card: '1.25rem', tile: '1.5rem' },
      boxShadow: {
        card: '0 1px 2px rgba(26, 26, 26, 0.06), 0 4px 16px rgba(26, 26, 26, 0.06)',
        raised: '0 6px 20px rgba(26, 26, 26, 0.18)',
      },
      transitionTimingFunction: { out: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.23, 1, 0.32, 1) infinite',
      },
      screens: { kiosk: '1080px' },
    },
  },
};
