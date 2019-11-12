import {Application} from 'express'

export default {
  setup(app: Application) {
    app.use(async (req, res, next) => {
      const start = Date.now()
      let isAssets = /\.(js|css|ico)$/
      await next()
      if (!isAssets.test(req.url)) {
        console.log(`[${new Date().toLocaleString()}][${Date.now() - start}ms][${req.method}][${res.statusCode}] "${req.url}" "${req.headers['user-agent']}"`)
      }
    })
  
  }
}
