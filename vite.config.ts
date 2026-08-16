import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
