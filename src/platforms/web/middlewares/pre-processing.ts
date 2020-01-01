import * as Bodyparse from 'body-parser'
import * as CORS from 'cors'
import {Application} from 'express'
import * as CookieParser from 'cookie-parser'

export default {
  setup(app: Application) {
    app.use(CORS())
    app.use(CookieParser())
    app.use(Bodyparse.urlencoded({extended: true}))
    app.use(Bodyparse.json())
  }
}
