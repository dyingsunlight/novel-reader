import startup from 'app/core/startup'
import app from './app.vue'
import reader from './store/reader'
import collection from './store/collection'
import visitedLink from './store/visited-link'
import routes from './routes'

startup(app, {
  routes,
  modules: {
    reader,
    collection,
    visitedLink
  },
  plugins: []
})
