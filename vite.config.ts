import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { imageToWebpPlugin } from 'vite-plugin-image-to-webp'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    imageToWebpPlugin({
      imageFormats: ['jpg', 'png'],
    }),
    ViteImageOptimizer({
      png: {
        quality: 75,
      },
      jpg: {
        quality: 75,
      },
      jpeg: {
        quality: 75,
      },
      webp: {
        quality: 75,
        lossless: true,
      },
    })
  ],
  base: process.env.GH_PAGES === 'true' ? '/react-betting' : '/'
})
