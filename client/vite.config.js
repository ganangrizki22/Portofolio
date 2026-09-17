import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Konfigurasi Vite untuk project React portofolio.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // Multi-page: halaman utama (index.html) + aplikasi to-do list
    // terpisah (todo.html), supaya "Pergi Ke" di card Proyek bisa
    // membuka halaman sungguhan, bukan cuma link kosong.
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        todo: resolve(__dirname, "todo.html"),
        toko: resolve(__dirname, "toko.html"),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Pakai Sass JS API modern (menghilangkan warning "legacy-js-api"),
        // dan bungkam warning deprecation "@import" yang berasal dari
        // Bootstrap serta partial SCSS kita sendiri (main.scss masih
        // memakai @import, bukan @use, agar sederhana untuk dipelajari).
        api: "modern",
        silenceDeprecations: ["import", "color-functions", "global-builtin"],
        quietDeps: true,
      },
    },
  },
});
