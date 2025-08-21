
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "default-border": "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Soil and sage theme colors - these map to the soil-50, soil-100, etc classes
        soil: {
          '50': '#f8f5f1',
          '100': '#eee7dc',
          '200': '#ddd2bd',
          '300': '#c7b696',
          '400': '#b69d77',
          '500': '#a68960',
          '600': '#957556',
          '700': '#7b5e48',
          '800': '#664e3f',
          '900': '#564337',
          '950': '#2f241e',
        },
        sage: {
          '50': '#f4f7f4',
          '100': '#e2eae1',
          '200': '#c7d5c6',
          '300': '#a3b9a2',
          '400': '#7d9a7c',
          '500': '#607c60',
          '600': '#4c654c',
          '700': '#3d5040',
          '800': '#344236',
          '900': '#2c372e',
          '950': '#161e17',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)"
          }
        },
        "fade-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(-10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)"
          }
        },
        "slide-right": {
          "0%": {
            transform: "translateX(-10px)"
          },
          "100%": {
            transform: "translateX(10px)"
          }
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1"
          },
          "50%": {
            opacity: "0.7"
          }
        },
        "spin-slow": {
          to: {
            transform: "rotate(360deg)"
          }
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-10%)",
          },
          "50%": {
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-left": "fade-left 0.5s ease-out",
        "fade-right": "fade-right 0.5s ease-out",
        "slide-right": "slide-right 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "spin-slow": "spin-slow 10s linear infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
