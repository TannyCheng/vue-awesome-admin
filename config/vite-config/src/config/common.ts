import { type UserConfig } from 'vite'
import UnoCss from 'unocss/vite'

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
  },
  plugins: [UnoCss()],
})

export { commonConfig }
