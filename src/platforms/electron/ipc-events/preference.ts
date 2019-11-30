import { MainIPC } from '../core/ipc'
import Database from '../database'

const PREFERENCE_PREFIX = '__electron-preference'
const PREFERENCE_KEY = 'main'

export const setup = function(ipc: MainIPC) {
  
  const updatePreference = async (config: string) => {
    const item = await Database.getStorageItem(PREFERENCE_PREFIX, PREFERENCE_KEY)
    if (item) {
      await Database.updateStoreItem(item.id, config)
    } else {
      await Database.addStorageItem(PREFERENCE_PREFIX, PREFERENCE_KEY, config)
    }
  }
  
  const reloadPreference = async () => {
    const data = await Database.getStorageItem(PREFERENCE_PREFIX, PREFERENCE_KEY)
    const config = JSON.parse((data && data.value) || '{}')
    
    if (config.proxyIsEnable) {
      process.env['PLATFORMS_SERVICE_PROXY_ENABLE'] = 'true'
    } else {
      delete process.env['PLATFORMS_SERVICE_PROXY_ENABLE']
    }
    
    if (config.proxyHost) {
      process.env['PLATFORMS_SERVICE_PROXY_HOST'] = config.proxyHost
    }
    if (config.proxyPort) {
      process.env['PLATFORMS_SERVICE_PROXY_PORT'] = config.proxyPort
    }
    if (config.proxyProtocol) {
      process.env['PLATFORMS_SERVICE_PROXY_PROTOCOL'] = config.proxyProtocol
    }
    

    
    if (config.proxyUsername) {
      process.env['PLATFORMS_SERVICE_PROXY_USERNAME'] = config.proxyUsername
    }
    if (config.proxyPassword) {
      process.env['PLATFORMS_SERVICE_PROXY_PASSWORD'] = config.proxyPassword
    }
  }
  
  let isRuining = false

  ipc.define('electron-preference.update', async (config: string) => {
    if (isRuining) return
    isRuining = true
    await updatePreference(config)
    await reloadPreference()
    isRuining = false
    return true
  })
  
  reloadPreference()
}

