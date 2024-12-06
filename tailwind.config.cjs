/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  darkMode: ["selector"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        neutral: {
          50: "#f7f9fc",
          100: "#ebeff5",
          200: "#c1cad7",
          300: "#a4b2c5",
          400: "#8396b1",
          500: "#66768e",
          600: "#566479",
          700: "#4c5a6e",
          800: "#384354",
          900: "#273141",
          950: "#171c25"
        },
        blue: {
          50: "#f5f8fe",
          100: "#e8effc",
          200: "#b5caf5",
          300: "#91b1f0",
          400: "#6793ea",
          500: "#3470e2",
          600: "#245dc8",
          700: "#2054b5",
          800: "#183f87",
          900: "#122f63",
          950: "#0b1b3b"
        },
        red: {
          50: "#fef6f8",
          100: "#fceaee",
          200: "#f6b9c5",
          300: "#f297a9",
          400: "#ed6983",
          500: "#df294d",
          600: "#bd2341",
          700: "#ab1f3b",
          800: "#81182c",
          900: "#611221",
          950: "#390b14"
        },
        green: {
          50: "#f4fbf8",
          100: "#ddf3ea",
          200: "#8cd8b8",
          300: "#53c595",
          400: "#19a96c",
          500: "#148555",
          600: "#117148",
          700: "#0f6641",
          800: "#0b4c31",
          900: "#083824",
          950: "#052115"
        },
        yellow: {
          50: "#fff9eb",
          100: "#ffeec9",
          200: "#ffbf34",
          300: "#e4a61e",
          400: "#c08b1a",
          500: "#976e14",
          600: "#805d11",
          700: "#73530f",
          800: "#563f0b",
          900: "#402e09",
          950: "#251a05"
        },
        orange: {
          50: "#fff6f4",
          100: "#ffebe6",
          200: "#ffb8a7",
          300: "#ff9379",
          400: "#ff5f3a",
          500: "#cf4625",
          600: "#b03b20",
          700: "#9f351d",
          800: "#772815",
          900: "#581e10",
          950: "#341109"
        },
        "neutral-bg": {
          50: "var(--color-background-50)",
          100: "var(--color-background-100)",
          200: "var(--color-background-200)",
          300: "var(--color-background-300)"
        },
        "neutral-typography": {
          50: "var(--color-typography-50)",
          100: "var(--color-typography-100)",
          200: "var(--color-typography-200)"
        },
        primary: {
          50: "var(--color-primary-50)",
          "50/10": "#2868e11a",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)"
        },
        danger: {
          50: "var(--color-danger-50)",
          100: "var(--color-danger-100)"
        },
        success: {
          50: "var(--color-success-50)",
          100: "var(--color-success-100)"
        },
        warning: {
          50: "var(--color-warning-50)",
          100: "var(--color-warning-100)"
        },
        accent: "var(--color-brand-accent)",
        progress: {
          color: "var(--color-progress)"
        },
        border: {
          color: "var(--border-color)",
          "hover-color": "var(--border-hover-color)"
        },
        spinner: {
          color: "var(--spinner-color)",
          "border-color": "var(--spinner-border-color)"
        },
        hover: {
          btn: "var(--color-hover)"
        },
        dialogs: {
          swap: {
            color: "var(--swap-confirmation-color)",
            inactive: "var(--swap-header-inactive-color)",
            stroke: "var(--swap-header-stroke)"
          }
        }
      }
    },
    fontFamily: {
      sans: ["Garet", "Helvetica", "Arial", "sans-serif"]
    },
    fontSize: {
      xs: ["0.8125rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.5rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
      10: ["10px", "14px"],
      12: ["12px", "normal"],
      14: ["14px", "normal"],
      16: ["16px", "23px"],
      18: ["18px", "26px"],
      20: ["20px", "29px"],
      28: ["28px", "46px"],
      32: ["32px", "46px"],
      40: ["40px", "58px"],
      48: ["48px", "70px"]
    },
    backgroundImage: {
      "white-noise": "url('../assets/images/white-noise.png')"
    },
    backgroundSize: {
      "50%": "15%"
    },
    boxShadow: {
      dialog: "0 8px 48px #072d6326",
      "field-heavy": "0px 8px 48px 0px rgba(7, 45, 99, 0.15)",
      "field-normal": "0px 12px 32px 0px rgba(7, 45, 99, 0.06)"
    },
    textShadow: {
      password: "0 0 0 var(--color-typography-200)"
    }
  },
  variants: {
    extend: {
      textColor: ["placeholder"]
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value
          })
        },
        { values: theme("textShadow") }
      );
    })
  ]
};
