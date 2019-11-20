import { Module } from "vuex"
import Vue from 'vue'
import { Collection, Services  } from '../local-model'
import * as MD5 from 'md5'

export default <Module<Collection, null>>{
  namespaced: true,
  state: {
    items: [],
    finishedJobs: []
  },
  getters: {
    localStorage(state) {
      return {
        items: state.items
      }
    },
    items(state) {
      return state.items
    },
    isReady(state) {
      return ['plugin:local-storage']
        .every(job => state.finishedJobs.includes(job))
    }
  },
  mutations: {
    remove(state, id: string) {
      const findIndex = state.items.findIndex(item => item.id === id)
      if (findIndex === -1) {
        state.items.splice(findIndex)
      }
    },
    add(state, payload: Services.Meta) {
      const snapshotPayload = JSON.parse(JSON.stringify(payload)) as Services.Meta
      const resolvedMeta: Services.ResolvedMeta = {
        ...snapshotPayload,
        id: MD5(snapshotPayload.url),
        createdAt: new Date().toUTCString(),
        lastVisit: null
      }
      if (!state.items) {
        Vue.set(state, 'items', [])
      }
      const findIndex = state.items.findIndex(item => item.id === resolvedMeta.id)
      if (findIndex !== -1) {
        state.items.splice(findIndex)
      }
      state.items.unshift(resolvedMeta)
    },
    visit(state, id: string) {
      const findIndex = state.items.findIndex(item => item.url === id)
      if (findIndex === -1) return
      state.items[findIndex].lastVisit = new Date().toUTCString()
    },
    finishJob(state, name) {
      state.finishedJobs.push(name)
    },
    restoreLocalStorage(state, payload: Collection) {
      if (!payload) return
      Vue.set(state, 'items', payload.items)
    }
  },
  actions: {
  
  }
}
