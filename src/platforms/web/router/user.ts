import accountController from '../controllers/account'
import { UserError } from '../model'
import {Request, Response} from "express"

export default {
  async register(req: Request, res: Response, next) {
    const payload = req.body
    const username = payload.username
    const email = payload.email
    const password = payload.password
    const name = payload.name || username || ''
    if (!username || !email || !password) {
      res.statusMessage = UserError.invalidParameters
      res.sendStatus(400)
    }
    try {
      res.send(await accountController.create(username, password, email, name))
    } catch (e) {
      if (e.message === UserError.userExisted) {
        res.statusMessage = UserError.userExisted
        res.sendStatus(409)
      } else {
        res.statusMessage = UserError.unknown
        res.sendStatus(500)
      }
    }
  },
  
  async login(req: Request, res: Response, next) {
    const payload = req.body
    const username = payload.username
    const password = payload.password
    
    if (!username || !password) {
      res.statusMessage = UserError.invalidParameters
      res.sendStatus(400)
      return
    }
    
    try {
      const session = await accountController.createSession(username, password)
      res.cookie('sessionId', session.sessionId, {
        expires: new Date(session.sessionExpireTime)
      })
      res.send(JSON.stringify(session))
    } catch (e) {
      if (e.message === UserError.userNotExisted) {
        res.statusMessage = UserError.userNotExisted
        res.sendStatus(404)
      } else if (e.message === UserError.passwordError) {
        res.statusMessage = UserError.passwordError
        res.sendStatus(401)
      } else {
        res.statusMessage = UserError.unknown
        res.sendStatus(500)
      }
    }
  },
  
  async profile(req: Request, res: Response, next) {
    const userData = (req as any).user
    if (!userData) {
      res.sendStatus(403)
    }
    delete userData.password
    res.send(userData)
  },
  
  async logout(req: Request, res: Response, next) {
    // For httpOnly cookie clean up
    res.cookie('email', null)
    res.cookie('username', null)
    res.cookie('name', null)
    // clean session
    const sessionId = req.headers['x-session-id'] || req.cookies('sessionId')
    if (sessionId) {
      res.cookie('sessionId', null)
      await accountController.removeSession(sessionId)
    }
    res.sendStatus(200)
  }
}
