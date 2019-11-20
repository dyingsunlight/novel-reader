import Axios from 'axios'

const usingProxy =  !!process.env['PLATFORMS_SERVICE_PROXY_ENABLE']

const proxyConfig = {
  host: process.env['PLATFORMS_SERVICE_PROXY_HOST'] || '127.0.0.1',
  port: process.env['PLATFORMS_SERVICE_PROXY_PORT'] || '1080',
  protocol: process.env['PLATFORMS_SERVICE_PROXY_PROTOCOL'] || 'http',
  username: process.env['PLATFORMS_SERVICE_PROXY_USERNAME'] || '',
  password: process.env['PLATFORMS_SERVICE_PROXY_PASSWORD'] || '',
}
/**
 
 **/
const getConfig = (config, {proxy = false}) => {
  
  const hadSetAuthentication = proxyConfig.username && proxyConfig.password
  const usingProxyConfig = (proxy ? {
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
  async get(url, config = {}, options = {}) {
    try {
      return await Axios.get(url, getConfig(config, {proxy: usingProxy}))
    } catch (e) {
      return e.response
    }
  },
  async post(url, body?, config?, options = {}) {
    try {
      return await Axios.post(url, body, getConfig(config, {proxy: usingProxy}))
    } catch (e) {
      return e.response
    }
  },
  async put(url, body?, config?, options = {}) {
    try {
      return await Axios.put(url, body, getConfig(config, {proxy: usingProxy}))
    } catch (e) {
      return e.response
    }
  },
  async delete(url, config?, options = {}) {
    try {
      return await Axios.delete(url, getConfig(config, {proxy: usingProxy}))
    } catch (e) {
      return e.response
    }
  }
}

