import Axios from 'axios'
import Logger from 'platforms/logger'
const logger = new Logger('network')

const getConfig = (config) => {
  const usingProxy =  !!process.env['PLATFORMS_SERVICE_PROXY_ENABLE']
  
  const proxyConfig = {
    host: process.env['PLATFORMS_SERVICE_PROXY_HOST'] || '127.0.0.1',
    port: process.env['PLATFORMS_SERVICE_PROXY_PORT'] || '1080',
    protocol: process.env['PLATFORMS_SERVICE_PROXY_PROTOCOL'] || 'http',
    username: process.env['PLATFORMS_SERVICE_PROXY_USERNAME'] || '',
    password: process.env['PLATFORMS_SERVICE_PROXY_PASSWORD'] || '',
  }
  
  const hadSetAuthentication = proxyConfig.username && proxyConfig.password
  const usingProxyConfig = (usingProxy ? {
    proxy: {
      host: proxyConfig.host || '',
      port: proxyConfig.port || '',
      protocol: proxyConfig.protocol,
    },
    ...(hadSetAuthentication ? {
      auth: {
        username: proxyConfig.username,
        password: proxyConfig.password
      }
    } : {})
  } : {})
  
  const headers = (config && config.headers) || {}
  return {
    ...config,
    ...usingProxyConfig,
    headers: {
      'Accept':  headers['Accept'] || 'text/html,application/xhtml+xml,application/xml',
      'User-Agent': headers['User-Agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3964.0 Safari/537.36'
    },
  }
}

export default {
  async get(url, config = {}) {
    const usingConfig = getConfig(config)
    try {
      return await Axios.get(url, usingConfig)
    } catch (e) {
      logger.error(e, usingConfig)
      return
    }
  },
  async post(url, body?, config?) {
    const usingConfig = getConfig(config)
    try {
      return await Axios.post(url, body, usingConfig)
    } catch (e) {
      logger.error(e, usingConfig)
      return
    }
  },
  async put(url, body?, config?) {
    const usingConfig = getConfig(config)
    try {
      return await Axios.put(url, body, usingConfig)
    } catch (e) {
      logger.error(e, usingConfig)
      return
    }
  },
  async delete(url, config?) {
    const usingConfig = getConfig(config)
    try {
      return await Axios.delete(url, usingConfig)
    } catch (e) {
      logger.error(e, usingConfig)
      return
    }
  }
}

