import { Module } from "vuex"
import Vue from 'vue'
import { VisitedLinks } from '../local-model'

export default <Module<VisitedLinks, null>>{
  namespaced: true,
  state: {
    links: [],
    finishedJobs: []
  },
  getters: {
    localStorage(state) {
      return {
        links: state.links
      }
    },
    links(state) {
      return state.links
    },
    isReady(state) {
      return ['plugin:local-storage']
        .every(job => state.finishedJobs.includes(job))
    }
  },
  mutations: {
    add(state, payload) {
      const findIndex = state.links.findIndex(item => item.id === payload.id)
      if (findIndex === -1) {
        state.links.splice(findIndex)
      }
      state.links.unshift(payload)
    },
    remove(state, id: string) {
      const findIndex = state.links.findIndex(item => item.id === id)
      if (findIndex === -1) {
        state.links.splice(findIndex)
      }
    },
    finishJob(state, name) {
      state.finishedJobs.push(name)
    },
    restoreLocalStorage(state, payload: VisitedLinks) {
      if (!payload) return
      if (payload.links) {
        Vue.set(state, 'links', payload.links)
      }
    }
  },
  actions: {
  
  }
}
