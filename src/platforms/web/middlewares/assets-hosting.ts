import {Application} from 'express'
import * as Express from 'express'
import * as path from "path"

export default {
  setup(app: Application) {
    app.use(Express.static(path.resolve(__dirname, '../app')))
  }
}
