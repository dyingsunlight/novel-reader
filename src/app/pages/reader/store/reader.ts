import { Module } from "vuex"
import vue from 'vue'
import { BaseStoreState } from "app/app-model"

interface ReaderState extends BaseStoreState{
  fullText?: string
  indicator?: number
  translatedTexts?: {[key: string]: string}
}

export default <Module<ReaderState, null>>{
  namespaced: true,
  state: {
    fullText: '',
    indicator: 0,
    translatedTexts: {},
  
    finishedJobs: []
  },
  getters: {
    fullText(state) {
      return state.fullText
    },
    indicator(state) {
      return state.indicator
    },
    localStorage(state) {
      return {
        indicator: state.indicator,
        fullText: state.fullText
      }
    },
    isReady(state) {
      return ['plugin:local-storage'].every(job => state.finishedJobs.includes(job))
    },
    size(state, getters) {
      return Object.keys(getters.untranslatedTexts).length
    },
    untranslatedTexts(state) {
      return (state.fullText || '').split('\n').filter(Boolean).reduce((prev, item, index) => {
        prev[index] = item
        return prev
      }, {})
    },
    translatedTexts(state) {
      return state.translatedTexts
    }
  },
  mutations: {
    translatedText(state, { indicator, text}) {
      vue.set(state.translatedTexts, indicator, text)
    },
    fullText(state, payload: string) {
      state.fullText = payload
      state.translatedTexts = {}
    },
    indicator(state, payload: number) {
      state.indicator = payload
    },
    finishJob(state, name) {
      state.finishedJobs.push(name)
    }
  },
  actions: {
    restoreLocalStorage({commit, state}, payload: ReaderState) {
      state.fullText = payload.fullText
      state.indicator = payload.indicator
    }
  }
}
