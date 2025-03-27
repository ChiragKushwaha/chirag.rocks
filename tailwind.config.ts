import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      animation: {
        typing: 'typing 2s steps(22)',
        blink: 'blink .5s step-end infinite alternate',
        slideInFromLeft:
          'slideInFromLeft 10s cubic-bezier(0, .9, .9, .999) forwards'
      },
      keyframes: {
        slideInFromLeft: {
          '0%': { width: '0%' },
          '99%': { width: '99%' }
        },
        typing: {
          from: { width: '0' }
        },
        blink: {
          '50%': { 'border-color': 'transparent' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
};
export default config;
