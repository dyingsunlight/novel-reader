import accountController from '../controllers/account'
import { UserError } from "../model"
import {Request, Response} from "express"

// export function verify(isOptional = false, onFailed = (...args) => {}) {
//   return async (req, res: Response, next) => {
//     const sessionId = req.headers['x-session-id'] || req.cookies['sessionId']
//     if (!sessionId) {
//       if (isOptional) {
//         return await next()
//       } else {
//         if (onFailed) {
//           await onFailed(res, req)
//           return
//         } else {
//           res.statusMessage = UserError.validationFailed
//           res.sendStatus(403)
//         }
//       }
//     }
//
//     const user = await accountController.findUserBySession(sessionId)
//     if (user) {
//       req.user = user
//     }
//     if (!isOptional && !user && res.writableFinished) {
//       if (onFailed) {
//         await onFailed(res, req)
//         return
//       } else {
//         res.statusMessage = UserError.validationFailed
//         res.sendStatus(403)
//       }
//     }
//     next()
//   }
// }

export function verify ({onFailed = null, onSucceed = null} = {}) {
  return async (req, res: Response, next) => {
    const onFailedHandler = async () => {
      if (onFailed) {
        await onFailed(res, req)
      } else {
        res.statusMessage = UserError.validationFailed
        res.sendStatus(403)
      }
    }
    const sessionId = req.headers['x-session-id'] || req.cookies['sessionId']
    
    if (!sessionId) {
      return onFailedHandler()
    }
    const user = await accountController.findUserBySession(sessionId)
    if (!user) {
      return onFailedHandler()
    }
    req.user = user
    ;(onSucceed || next)()
  }
}
