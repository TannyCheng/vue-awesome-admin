export interface GlobConfig {
  // Website title
  title: string
  // Service interface url
  apiUrl: string
  // Service interface url prefix
  apiUrlPrefix: string
  // upload url
  uploadUrl: string
  // Project abbreviation
  shortName: string
}

export interface GlobEnvConfig {
  // Website title
  VITE_GLOB_APP_TITLE: string
  // Service interface url
  VITE_GLOB_API_URL: string
  // Service interface url prefix
  VITE_GLOB_API_URL_PREFIX: string
  // upload url
  VITE_GLOB_UPLOAD_URL: string
}
