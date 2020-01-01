import {Request, Response} from 'express'
import SiteResolverController from '../controllers/site-resolver'

export default {
  async meta(req: Request, res: Response, next) {
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
  },
  
  async chapter(req: Request, res: Response, next) {
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
  }
}
