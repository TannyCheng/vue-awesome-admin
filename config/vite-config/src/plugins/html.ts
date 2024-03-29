import type { PluginOption } from 'vite'
import { createHtmlPlugin as htmlPlugin } from 'vite-plugin-html'

export function createHtmlPlugin({ isBuild }: { isBuild: boolean }): PluginOption {
  const html: PluginOption[] = htmlPlugin({
    minify: isBuild,
  })
  return html
}
