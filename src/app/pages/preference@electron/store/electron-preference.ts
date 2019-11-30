import { Module } from "vuex"
import { ElectronPreference } from '../local-model'


export default <Module<ElectronPreference, null>>{
  namespaced: true,
  state: {
    proxyHost: '127.0.0.1',
    proxyPassword: '',
    proxyUsername: '',
    proxyProtocol: 'http',
    proxyPort: '1080',
    proxyIsEnable: false,
    finishedJobs: []
  },
  getters: {
    localStorage(state) {
      return {
        proxyIsEnable: state.proxyIsEnable || false,
        proxyHost: state.proxyHost || '',
        proxyPassword: state.proxyPassword || '',
        proxyUsername: state.proxyUsername || '',
        proxyProtocol: state.proxyProtocol || '',
        proxyPort: state.proxyPort || '',
      }
    },
    
    snapshot(state, getters) {
      return getters.localStorage
    },
    
    isReady(state) {
      return ['plugin:local-storage']
        .every(job => state.finishedJobs.includes(job))
    }
  },
  mutations: {
    update(state, payload) {
      if (!payload) return
      state.proxyIsEnable = typeof payload.proxyIsEnable === 'boolean' ? payload.proxyIsEnable : state.proxyIsEnable || false
      state.proxyProtocol = typeof payload.proxyProtocol === 'string' ? payload.proxyProtocol : state.proxyProtocol || ''
      state.proxyHost = typeof payload.proxyHost === 'string' ? payload.proxyHost : state.proxyHost || ''
      state.proxyPort = typeof payload.proxyPort === 'string' ? payload.proxyPort : state.proxyPort || ''
      state.proxyPassword = typeof payload.proxyPassword === 'string' ? payload.proxyPassword : state.proxyPassword || ''
      state.proxyUsername = typeof payload.proxyUsername === 'string' ? payload.proxyUsername : state.proxyUsername || ''
    },
    finishJob(state, name) {
      state.finishedJobs.push(name)
    }
  },
  actions: {
    restoreLocalStorage({ commit }, payload) {
      commit('update', payload)
    }
  }
}
