import { resolve } from 'node:path'
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite'
import { readPackageJSON } from 'pkg-types'
import { format } from 'date-fns'
import { commonConfig } from './common'
import { createPlugins } from '../plugins'

interface DefinedOptions {
  overrides?: UserConfig
  options?: {}
}

function defineApplicationConfig(definedOptions: DefinedOptions = {}) {
  const { overrides = {} } = definedOptions

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd()
    const isBuild = command === 'build'
    const { VITE_PUBLIC_PATH, VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(
      mode,
      root,
    )
    const plugins = await createPlugins({
      root,
      isBuild,
      enableMock: VITE_USE_MOCK === 'true',
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true',
      compress: VITE_BUILD_COMPRESS,
    })

    const definedData = await createDefinedData(root)

    const pathResolve = (path: string) => resolve(root, '.', path)
    const timeStamp = Date.now()
    const applicationConfig: UserConfig = {
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: [
          // @/xxx => src/xxx
          {
            find: '/@//',
            replacement: pathResolve('src') + '/',
          },
          // #/xxx => types/xxx
          {
            find: '/#//',
            replacement: pathResolve('types') + '/',
          },
        ],
      },
      define: definedData,
      build: {
        target: 'es2015',
        cssTarget: 'chrome80',
        rollupOptions: {
          output: {
            entryFileNames: `assets/entry/[name]-[hash]-${timeStamp}.js`,
            manualChunks: {
              vue: ['vue', 'vue-router', 'pinia'],
              arco: [],
            },
          },
        },
      },
      css: {
        preprocessorOptions: {
          less: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
      plugins,
    }
    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig)

    return mergeConfig(mergedConfig, overrides)
  })
}

async function createDefinedData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root)
    const { name, version, dependencies, devDependencies } = pkgJson

    const __APP__INFO = {
      pkg: { name, version, dependencies, devDependencies },
      lastBuildTime: format(new Date(), 'YYYY-MM-dd HH:mm:ss'),
    }
    return {
      __APP__INFO: JSON.stringify(__APP__INFO),
    }
  } catch (error) {
    return {}
  }
}

export { defineApplicationConfig }
