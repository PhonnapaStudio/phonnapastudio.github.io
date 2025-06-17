// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://phonnapastudio.github.io/",
  base: "/",

  //   integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filenameBase: "mainmap",
      changefreq: "monthly", // index.astro ไม่ได้เปลี่ยนบ่อย
      priority: 1.0, // หน้า Landing Page สำคัญที่สุด
    }),
  ],
});
