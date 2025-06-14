import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS の設定
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
