import { readPackageJSON } from 'pkg-types'
import { getEnvConfig } from '../utils/env'
import { createContentHash } from '../utils/hash'
import { PluginOption } from 'vite'
import pc from 'picocolors'

export const GLOBAL_CONFIG_FILE_NAME = '_app.config.js'
const PLUGIN_NAME = 'app-config'

async function createAppConfigPlugin({
  isBuild,
  root,
}: {
  isBuild: boolean
  root: string
}): Promise<PluginOption> {
  let publicPath: string
  let source: string

  if (!isBuild) {
    return {
      name: PLUGIN_NAME,
    }
  }
  const { version = '' } = await readPackageJSON(root)

  return {
    name: PLUGIN_NAME,
    async configResolved(_config: any) {
      const appTitle = _config?.env.VITE_GLOB_APP_TITLE ?? ''
      publicPath = _config.base
      source = await getConfigSource(appTitle)
    },
    async transformIndexHtml(html: any) {
      publicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`
      const appConfigSrc = `${publicPath || '/'}${GLOBAL_CONFIG_FILE_NAME}?v=${version}-${createContentHash(source)}`

      return {
        html,
        tags: [{ tag: 'script', attrs: { src: appConfigSrc } }],
      }
    },
    async generateBundle() {
      try {
        this.emitFile({
          type: 'asset',
          fileName: GLOBAL_CONFIG_FILE_NAME,
          source,
        })
        console.log(pc.cyan('✨configuration file is build successfully!'))
      } catch (error) {
        console.error(pc.red('❌configuration file failed to package:\n') + error)
      }
    },
  }
}

/**
 * get the configuration file variable name
 * @param title
 */
const getVariableName = (title: string) => {
  function strToHex(str: string) {
    const result: string[] = []
    for (let i = 0; i < str.length; i++) {
      const hex = str.charCodeAt(i).toString(16)
      result.push(('000' + hex).slice(-4))
    }
    return result.join('').toUpperCase()
  }
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '')
}

async function getConfigSource(appTitle: string) {
  const config = await getEnvConfig()
  const variableName = getVariableName(appTitle)
  const windowVariable = `window.${variableName}`

  // Ensure that the variable will not be modified
  let source = `${windowVariable}=${JSON.stringify(config)};`
  source += `
    Object.freeze(${windowVariable});
    Object.defineProperty(window, '${variableName}', {
      configurable: false,
      writable: false,
    });
  `.replace(/\s/g, '')
  return source
}

export { createAppConfigPlugin }
