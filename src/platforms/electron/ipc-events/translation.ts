import { MainIPC } from '../library/ipc'
import { translator } from 'platforms/services'

export const setup = function(ipc: MainIPC) {
  ipc.define('translate', async ({params, options}) => {
    return await translator(params, options)
  })
}
