import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { imageToWebpPlugin } from 'vite-plugin-image-to-webp'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filepath = fileURLToPath(import.meta.url)
const __dirname = dirname(__filepath)

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
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@types': resolve(__dirname, 'src/@types'),
      '@fonts': resolve(__dirname, 'src/assets/fonts'),
      '@img': resolve(__dirname, 'src/assets/img'),
      '@icons': resolve(__dirname, 'src/assets/icons'),
      '@components': resolve(__dirname, 'src/components'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@redux': resolve(__dirname, 'src/redux'),
      '@api': resolve(__dirname, 'src/api'),
      '@services': resolve(__dirname, 'src/services'),
      '@models': resolve(__dirname, 'src/models')
    }
  },
  base: process.env.GH_PAGES === 'true' ? '/react-betting' : '/'
})
