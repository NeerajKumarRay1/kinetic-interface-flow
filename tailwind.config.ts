import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        "background-secondary": "hsl(var(--background-secondary))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          light: "hsl(var(--secondary-light))",
          dark: "hsl(var(--secondary-dark))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
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
          hover: "hsl(var(--card-hover))",
        },
        "user-message": {
          DEFAULT: "hsl(var(--user-message))",
          foreground: "hsl(var(--user-message-foreground))",
        },
        "bot-message": {
          DEFAULT: "hsl(var(--bot-message))",
          foreground: "hsl(var(--bot-message-foreground))",
        },
        "confidence-high": "hsl(var(--confidence-high))",
        "confidence-medium": "hsl(var(--confidence-medium))",
        "confidence-low": "hsl(var(--confidence-low))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "slide-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "typing": {
          "0%, 60%, 100%": {
            transform: "translateY(0)",
          },
          "20%": {
            transform: "translateY(-3px)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-200px 0",
          },
          "100%": {
            backgroundPosition: "calc(200px + 100%) 0",
          },
        },
        "bounce-gentle": {
          "0%, 20%, 53%, 80%, 100%": {
            transform: "translate3d(0, 0, 0)",
          },
          "40%, 43%": {
            transform: "translate3d(0, -8px, 0)",
          },
          "70%": {
            transform: "translate3d(0, -4px, 0)",
          },
          "90%": {
            transform: "translate3d(0, -2px, 0)",
          },
        },
        "wiggle": {
          "0%, 7%": {
            transform: "rotateZ(0)",
          },
          "15%": {
            transform: "rotateZ(-15deg)",
          },
          "20%": {
            transform: "rotateZ(10deg)",
          },
          "25%": {
            transform: "rotateZ(-10deg)",
          },
          "30%": {
            transform: "rotateZ(6deg)",
          },
          "35%": {
            transform: "rotateZ(-4deg)",
          },
          "40%, 100%": {
            transform: "rotateZ(0)",
          },
        },
        "sparkle": {
          "0%": {
            opacity: "0",
            transform: "scale(0.5) rotate(0deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.2) rotate(180deg)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.5) rotate(360deg)",
          },
        },
        "heart-beat": {
          "0%": {
            transform: "scale(1)",
          },
          "14%": {
            transform: "scale(1.1)",
          },
          "28%": {
            transform: "scale(1)",
          },
          "42%": {
            transform: "scale(1.1)",
          },
          "70%": {
            transform: "scale(1)",
          },
        },
        "celebration": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
          },
          "25%": {
            transform: "scale(1.1) rotate(-5deg)",
          },
          "50%": {
            transform: "scale(1.2) rotate(5deg)",
          },
          "75%": {
            transform: "scale(1.1) rotate(-3deg)",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "slide-in-left": "slide-in-left 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "typing": "typing 1.4s infinite ease-in-out",
        "pulse-glow": "pulse-glow 1.5s infinite",
        "shimmer": "shimmer 2s infinite linear",
        "bounce-gentle": "bounce-gentle 0.6s ease-out",
        "wiggle": "wiggle 0.5s ease-in-out",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "heart-beat": "heart-beat 1.2s ease-in-out infinite",
        "celebration": "celebration 0.8s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
