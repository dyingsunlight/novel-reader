import startup from 'app/core/startup'
import app from './app.vue'
import electronPreference from './store/electron-preference'

startup(app, {
  modules: {
    electronPreference
  },
  plugins: []
})
