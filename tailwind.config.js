/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          200: "#BABABA",
          300: "#989898",
          400: "#757575",
          500: "#535353",
          600: "#484848",
          700: "#3C3C3C",
          800: "#2E2E2E",
          900: "#252525",
        },
        primary: {
          50: "#FFFFFF",
          300: "#D6D6D6",
          600: "#404040",
          700: "#2D2D2D",
          900: "#1A1A1A",
        },
      },
    },
  },
  plugins: [],
};
