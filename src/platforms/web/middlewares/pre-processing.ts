import * as Bodyparse from 'body-parser'
import * as CORS from 'cors'
import {Application} from 'express'

export default {
  setup(app: Application) {
    app.use(CORS())
    app.use(Bodyparse.urlencoded({extended: true}))
    app.use(Bodyparse.json())
  }
}
