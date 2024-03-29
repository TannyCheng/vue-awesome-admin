import { defineApplicationConfig } from '@awesome/vite-config'

export default defineApplicationConfig({
  overrides: {
    server: {
      open: true,
      warmup: {
        clientFiles: ['index.html', './src/{views,components}/*'],
      },
    },
  },
})
