import Vue from 'vue'
import Vuex from 'vuex'
import VueCompositionApi from '@vue/composition-api';
import preference from './store/preference'
import createStoragePlugin from './store/plugins/storage'

Vue.use(Vuex)
Vue.use(VueCompositionApi)

export default function (app, { modules = {}, plugins = [] } = {}) {
  const usingModules = {
    ...modules,
    preference
  }

  const store = new Vuex.Store({
    modules: usingModules,
    plugins: [
      ...plugins,
      createStoragePlugin(usingModules)
    ]
  })
  
  // @ts-ignore
  window.$store = store

  return new Vue({
    el: '#app',
    render: h => h(app),
    store
  })
}
