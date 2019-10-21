import {Application} from 'express'
import * as translator from 'translation.js'
import Axios from 'axios'

export default {
  setup(app: Application) {
    app.post('/text/translation', async (req, res, next) => {

      const body = req.body || {}
      const engine = (body.engine || '').toLowerCase()
      const params = body.params

      if (!engine || !params || !translator[engine] || typeof params !== 'object') {
        res.sendStatus(403)
        return
      }
      
      let data
      try {
         data = await translator[engine].translate(params)
      } catch (e) {
        console.error(e)
        res.sendStatus(500)
      }
      res.send(data)
    })
    
    app.get('/text/audio', async (req, res, next) => {
      const audioURL = req.query['url']
      console.log('audioURL', audioURL)
      if (!audioURL) {
        res.sendStatus(400)
        return
      }
    
      const audioPipe = await Axios.get(audioURL, {
        responseType:'stream'
      })
    
      console.log('audioPipe.headers[\'content-type\']', audioPipe.headers['content-type'], audioPipe.headers)
    
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
    
  }
}
