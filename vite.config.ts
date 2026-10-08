import { fileURLToPath } from 'node:url'
import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig } from 'vite'
import { WeappTailwindcss } from 'weapp-tailwindcss/vite'

export default defineConfig({
  plugins: [
    uni(),
    WeappTailwindcss({
      cssEntries: [fileURLToPath(new URL('./src/styles/tailwind.css', import.meta.url))],
      cssOptions: { rem2rpx: true },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  optimizeDeps: { exclude: ['@wot-ui/ui'] },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
})
