import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: '/AgentAcademy',
  server: {
    // Configure proxy for dev server.
    proxy: {
      '/api': {
        target: 'https://agentacademyapi-uat.bangkoklife.com:9443/',
        // target:
        // 'https://extdev.bangkoklife.com:8443/AgentAcademyCenterExternal/AgentAcademyAPI/',
        changeOrigin: true,
        secure: true
        //rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/style/_variables.scss";`
      }
    }
  }
})
