import * as translator from 'translation.js'
import TranslationController from '../controllers/translation'
import Axios from 'axios'

export default {
  async translate(req, res, next) {
    
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
      data = await TranslationController.translate(params, {engine, marker})
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
    res.send(data)
  },
  //
  async audioStream(req, res, next) {
    const audioURL = req.query['url']
    if (!audioURL) {
      res.sendStatus(400)
      return
    }
    
    const audioPipe = await Axios.get(audioURL, {
      responseType: 'stream'
    })
    
    res.setHeader("content-type", audioPipe.headers['content-type'])
    
    audioPipe.data.pipe(res)
  },
  async audioURL(req, res, next) {
    
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
    
  }
}
