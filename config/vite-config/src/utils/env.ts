import { readFile } from 'fs-extra'
import { join } from 'path'
import dotenv from 'dotenv'

/**
 * 获取当前环境下生效的环境变量文件
 */
function getConfigFiles() {
  const script = process.env.npm_lifecycle_script as string
  const reg = new RegExp('--mode ([a-z_\\d]+)')
  const result = reg.exec(script)

  if (result) {
    const mode = result[1]
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.production']
}

/**
 * Get the environment variables starting with speicified prefix
 * @param match prefix
 * @param configFiles ext
 */
export async function getEnvConfig(
  match = 'VITE_GLOB_',
  configFiles = getConfigFiles(),
): Promise<Record<string, string>> {
  let envConfig = {}

  for (const configFile of configFiles) {
    try {
      const envPath = await readFile(join(process.cwd(), configFile), { encoding: 'utf-8' })
      const env = dotenv.parse(envPath)
      envConfig = { ...envConfig, ...env }
    } catch (error) {
      console.error(`Error in parsing ${configFile}`, error)
    }
  }
  const reg = new RegExp(`^(${match})`)
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })
  return envConfig
}
