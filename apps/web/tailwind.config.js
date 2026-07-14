/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          black: '#000000',
          orange: '#FF6B00',
        },
        // Secondary Colors
        secondary: {
          dark: '#1A1A1A',
          medium: '#2D2D2D',
          light: '#4B5563',
        },
        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        // Interactive Elements
        interactive: {
          primary: '#FF6B00',
          hover: '#C2410C',
          disabled: '#374151',
          border: '#4B5563',
          'border-hover': '#FF6B00',
        },
        // Special Elements
        special: {
          success: '#FBBF24',
          error: '#DC2626',
        },
        brand: '#3D81E3',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      animation: {
        shiny: 'shiny 6s linear infinite',
      },
      keyframes: {
        shiny: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        }
      },
    },
  },
  plugins: [],
};
