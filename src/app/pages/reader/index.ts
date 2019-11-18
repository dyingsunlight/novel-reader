import startup from 'app/core/startup'
import app from './components/app.vue'
import reader from './store/reader'

startup(app, {
  modules: {
    reader
  },
  plugins: []
})
