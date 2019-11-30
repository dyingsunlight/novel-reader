import {Application, Request, Response} from 'express'
import * as translator from 'translation.js'
import TranslationController from '../controllers/translation'
import SiteResolverController from '../controllers/site-resolver'
import Axios from 'axios'

export default {
  setup(app: Application) {
    app.post('/text/translation', async (req, res, next) => {

      const body = req.body || {}
      const engine = (body.engine || '').toLowerCase()
      const marker = (body.marker || '').toLowerCase()
      const params = body.params

      if (!engine || !params || !translator[engine] || typeof params !== 'object') {
        res.sendStatus(403)
        return
      }
      
      let data
      try {
         data = await TranslationController.translate(params, { engine, marker})
      } catch (e) {
        console.error(e)
        res.sendStatus(500)
      }
      res.send(data)
    })
    
    app.get('/text/audio', async (req, res, next) => {
      const audioURL = req.query['url']
      if (!audioURL) {
        res.sendStatus(400)
        return
      }
    
      const audioPipe = await Axios.get(audioURL, {
        responseType:'stream'
      })
      
      res.setHeader("content-type", audioPipe.headers['content-type']);
    
      audioPipe.data.pipe(res)
    })
  
    app.post('/text/audio', async (req, res, next) => {
    
      const body = req.body || {}
      const engine = (body.engine || '').toLowerCase()
      const params = body.params
    
      if (!engine || !params || !translator[engine] || typeof params !== 'object') {
        res.sendStatus(403)
        return
      }
    
      let audioURL
      try {
        audioURL = await translator[engine].audio(params)
      } catch (e) {
        console.error(e)
        res.sendStatus(500)
      }
      
      res.send(audioURL)

    })
  
    app.get('/novel/meta', async (req: Request, res: Response, next) => {
      const url = req.query['url']
      if (!url) {
        res.sendStatus(400)
        return
      }
      
      try {
        const data = await SiteResolverController.getMeta(url)
        res.contentType('application/json')
        res.send(data)
      } catch (e) {
        console.error(e)
        res.sendStatus(500)
      }
    })
    
    app.get('/novel/chapter', async (req: Request, res: Response, next) => {
      const url = req.query['url']
      if (!url) {
        res.sendStatus(400)
        return
      }
    
      try {
        const data = await SiteResolverController.getChapter(url)
        res.contentType('text/plain')
        res.send(data)
      } catch (e) {
        console.error(e)
        res.sendStatus(500)
      }
    
    })
  }
}
