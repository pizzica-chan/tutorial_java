import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { tracks } from "./src/data/curriculum";

const siteOrigin = "https://tutorial-java.kitchen1217.workers.dev";

// src/App.tsx の、パラメータを持たないページ。旧 URL のリダイレクトは載せない
const staticPages = ["/", "/cheatsheet", "/devtools", "/eclipse", "/glossary"];

/** 章と項目の一覧から sitemap.xml を書き出す。章を足しても手で直さなくて済むようにする */
function sitemap(): Plugin {
  return {
    name: "sitemap",
    apply: "build",
    generateBundle() {
      const paths = [
        ...staticPages,
        ...tracks.flatMap((track) => [
          `/tracks/${track.id}`,
          ...track.lessons.map((lesson) => `/tracks/${track.id}/${lesson.id}`),
        ]),
      ];
      const urls = paths.map((path) => `  <url><loc>${siteOrigin}${encodeURI(path)}</loc></url>`).join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemap()],
  build: {
    rollupOptions: {
      output: {
        // 教材は頻繁に直す。ライブラリ側を別ファイルにして、再訪時の再取得を教材分だけにする
        manualChunks(id) {
          if (id.includes("node_modules/highlight.js")) return "highlight";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});
