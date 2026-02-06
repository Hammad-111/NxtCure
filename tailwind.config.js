/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        nxtcure: {
          primary: '#0FB9B1', // Professional Medical Teal
          secondary: '#2D98DA', // Professional Clinic Blue
          accent: '#7158E2', // Soft DNA Purple
          danger: '#FF4757', // Alert Red
          info: '#2F3542', // Deep Navy for high-contrast text
          bg: '#F1F2F6', // Soft Light Grey-Blue
          text: '#2D3436',
          subtext: '#636E72',
          white: '#FFFFFF',
        }
      }
    },
  },
  plugins: [],
}
