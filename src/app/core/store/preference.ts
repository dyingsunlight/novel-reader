import {Module} from "vuex"
import {PreferenceState} from "app/app-model"

export default <Module<PreferenceState, null>>{
  namespaced: true,
  state: {
    translationEngine: 'youdao',
    translationEngines: ['youdao', 'baidu', 'google'],
    
    speakingEngine: 'browser',
    speakingEngines: [
      'youdao', 'baidu', 'google'
    ],
    speakingRate: 1,
    speakingPitch: 1,
    
    finishedJobs: []
  },
  getters: {
    snapshot(state) {
      const data: PreferenceState = {}
      const keys: (keyof PreferenceState)[]= [
        'translationEngine',
        'translationEngines',
        'speakingEngine',
        'speakingPitch',
        'speakingRate'
      ]
      keys.forEach(key => {
        if (key in state) {
          (data as any)[key] = state[key]
        }
      })
      return data
    },
    
    localStorage(state, getters) {
      return getters.snapshot
    },
    isReady(state) {
      return ['plugin:local-storage']
        .every(job => state.finishedJobs.includes(job))
    }
  },
  mutations: {
    update(state: PreferenceState, payload: PreferenceState) {
      const isSupportBroswerSpeaking = 'speechSynthesis' in window
      
      if (!isSupportBroswerSpeaking) {
        payload.speakingEngines = payload.speakingEngines.slice(0).filter(engine => engine !== 'browser')
        payload.speakingEngine = payload.speakingEngines[0] || 'google'
      }
      
      const keys: (keyof PreferenceState)[]= [
        'translationEngine',
        'translationEngines',
        'speakingEngine',
        'speakingPitch',
        'speakingRate'
      ]
      keys.forEach(key => {
        if (key in payload) {
          (state as any)[key] = payload[key]
        }
      })
    },
    
    finishJob(state, name) {
      state.finishedJobs.push(name)
    }
  },
  actions: {
    restoreLocalStorage({commit}, payload) {
      commit('update', payload)
    },
  }
}
