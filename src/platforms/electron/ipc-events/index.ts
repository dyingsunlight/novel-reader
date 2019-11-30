import { setup as setupResolver } from './resolver'
import { setup as setupStorage } from './storage'
import { setup as setupTranslation } from './translation'
import { setup as setupElectronPreference } from './preference'
import { MainIPC } from '../core/ipc'

export const setup = function (ipc: MainIPC) {
  setupResolver(ipc)
  setupStorage(ipc)
  setupTranslation(ipc)
  setupElectronPreference(ipc)
}
