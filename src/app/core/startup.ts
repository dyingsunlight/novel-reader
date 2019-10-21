import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function (app, options?) {

  const store = new Vuex.Store((options && options.store) || {
    modules: {
    }
  })

  return new Vue({
    ...(options || {}),
    el: '#app',
    render: h => h(app),
    store
  })
}
