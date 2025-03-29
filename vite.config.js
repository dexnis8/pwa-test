import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // Tailwind v4 configuration
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
      theme: {
        extend: {
          fontFamily: {
            primary: ['"Proxima Nova"', "sans-serif"],
            secondary: ["Coolvetica", "sans-serif"],
          },
          colors: {
            primary: "#ffffff",
          },
        },
      },
    }),
    VitePWA({
      registerType: "autoUpdate", // This ensures the SW checks for updates automatically
      manifest: {
        name: "The Pace App",
        short_name: "Pace App",
        description: "Pace management application",
        theme_color: "#3DD7A1",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
