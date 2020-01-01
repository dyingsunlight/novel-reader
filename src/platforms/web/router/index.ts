import {Application, Request, Response} from 'express'
import ResolverRouter from './resolver'
import TranslationRouter from './translation'
import UserRouter from './user'
import * as AuthenticationRouter from './authentication'

export default {
  setup(app: Application) {
    app.post('/api/text/translation', AuthenticationRouter.verify(), TranslationRouter.translate)
    app.get('/api/text/audio', AuthenticationRouter.verify(), TranslationRouter.audioStream)
    app.post('/api/text/audio', AuthenticationRouter.verify(), TranslationRouter.audioURL)
    
    app.get('/api/novel/meta', AuthenticationRouter.verify(), ResolverRouter.meta)
    app.get('/api/novel/chapter', AuthenticationRouter.verify(), ResolverRouter.chapter)
    app.put('/api/user/register', (req, res, next) => {
      if (process.env['DISABLED_REGISTER']) {
        res.statusMessage = 'Register has been disabled'
        res.sendStatus(403)
        return
      } else {
        next()
      }
    }, UserRouter.register)
    app.post('/api/user/login', UserRouter.login)
    app.get('/api/user/profile', AuthenticationRouter.verify(), UserRouter.profile)
    app.post('/api/user/logout', UserRouter.logout)
  
    // Ensure Reader page must login to access it
    app.get('/reader/*', AuthenticationRouter.verify({
      onFailed: (res, req) => {
        res.redirect('/account/index.html')
      }
    }), (req, res, next) => next())
  }
}
