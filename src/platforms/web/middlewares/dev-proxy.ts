import {Application, Response} from 'express'
import * as Proxy from 'express-http-proxy'

export default {
  setup(app: Application) {
    const developmentPort = process.env['DEVELOPMENT_PORT']
    if (developmentPort) {
      app.get('/account/index.html', (req, res: Response, next) => res.redirect('/account@web/index.html'))
      app.use('*', Proxy(`127.0.0.1:${developmentPort}`, {
        proxyReqPathResolver: req =>  req.params[0]
      }))
    }
  }
}
