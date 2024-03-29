import { type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createAppConfigPlugin } from './application'
import { createVisualizerPlugin } from './visualizer'
import { createHtmlPlugin } from './html'
import { createCompressPlugin } from './compress'

interface Options {
  isBuild: boolean
  root: string
  enableAnalyze?: boolean
  enableMock?: boolean
  compress: string
}

async function createPlugins({ isBuild, root, enableAnalyze, /* enableMock */ compress }: Options) {
  const plugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()]

  const appConfigPlugin = await createAppConfigPlugin({ root, isBuild })

  plugins.push(appConfigPlugin)
  plugins.push(createHtmlPlugin({ isBuild }))

  if (isBuild) {
    plugins.push(createCompressPlugin({ compress }))
  }

  if (enableAnalyze) {
    plugins.push(createVisualizerPlugin())
  }

  // TODO: Mock config
  // if (enableMock) {
  // }

  return plugins
}

export { createPlugins }
