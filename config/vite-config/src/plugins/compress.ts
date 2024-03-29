import type { PluginOption } from 'vite'
import compressPlugin from 'vite-plugin-compress'

export function createCompressPlugin({
  compress,
  deleteOriginFile = false,
}: {
  compress: string
  deleteOriginFile?: boolean
}): PluginOption[] {
  const list = compress.split('|')
  const plugins: PluginOption[] = []

  if (list.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      } as any),
    )
  }

  if (list.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      } as any),
    )
  }

  return plugins
}
