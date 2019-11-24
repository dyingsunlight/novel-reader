import { setup as setupResolver } from './resolver'
import { setup as setupStorage } from './storage'
import { setup as setupTranslation } from './translation'
import { MainIPC } from '../library/ipc'

export const setup = function (ipc: MainIPC) {
  setupResolver(ipc)
  setupStorage(ipc)
  setupTranslation(ipc)
}
