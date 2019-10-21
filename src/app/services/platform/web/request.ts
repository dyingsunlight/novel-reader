import Axios from 'axios'

const host = process.env['WEB_BACKEND_HOST'] || ''

export default {
  async get(url, config?) {
    try {
      return await Axios.get(host + url, config)
    } catch (e) {
      return e.response
    }
  },
  async post(url, body?, config?) {
    try {
      return await Axios.post(host + url, body, config)
    } catch (e) {
      return e.response
    }
  },
  async put(url, body?, config?) {
    try {
      return await Axios.put(host + url, body, config)
    } catch (e) {
      return e.response
    }
  },
  async delete(url, config?) {
    try {
      return await Axios.delete(host + url, config)
    } catch (e) {
      return e.response
    }
  },
  
  url(url = '') {
    return host + url
  }
}
