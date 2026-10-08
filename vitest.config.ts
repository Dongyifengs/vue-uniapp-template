import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// 单元测试不加载 uni-app 的平台编译插件。
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'node',
    include: ['test/unit/**/*.test.{ts,js}'],
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/composables/**/*.ts', 'src/stores/**/*.ts', 'src/utils/**/*.ts'],
      reporter: ['text', 'html', 'lcov'],
    },
  },
})
