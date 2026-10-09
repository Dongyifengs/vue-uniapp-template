import { fileURLToPath } from 'node:url'
import uni from '@dcloudio/vite-plugin-uni'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import { WeappTailwindcss } from 'weapp-tailwindcss/vite'

export default defineConfig(async ({ command, mode }) => {
  const { VITE_PROXY_TARGET = '' } = loadEnv(mode, process.cwd())
  const proxyTarget = VITE_PROXY_TARGET.trim()
  const analyze = command === 'build' && process.env.ANALYZE === 'true'
  const visualizerPlugin = analyze
    ? ((await import('rollup-plugin-visualizer')).visualizer({
        filename: fileURLToPath(new URL('./dist/analyze/mp-weixin.html', import.meta.url)),
        gzipSize: true,
      }) as PluginOption)
    : null

  return {
    plugins: [
      uni(),
      WeappTailwindcss({
        cssEntries: [fileURLToPath(new URL('./src/styles/tailwind.css', import.meta.url))],
        cssOptions: { rem2rpx: true },
      }),
      ...(visualizerPlugin ? [visualizerPlugin] : []),
    ],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    optimizeDeps: { exclude: ['@wot-ui/ui'] },
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      ...(proxyTarget ? { proxy: { '/api': { target: proxyTarget, changeOrigin: true } } } : {}),
    },
  }
})
