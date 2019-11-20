import Vue from 'vue'
import Vuex from 'vuex'
import VueCompositionApi from '@vue/composition-api';
import preference from './store/preference'
import createStoragePlugin from './store/plugins/storage'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueCompositionApi)

export default function (app, { modules = {}, plugins = [], routes = [] } = {}) {
  const usingModules = {
    ...modules,
    preference
  }
  
  const router = new VueRouter({
    routes
  })
  
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
    router,
    render: h => h(app),
    store
  })
}
