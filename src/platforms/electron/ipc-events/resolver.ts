import { MainIPC } from '../library/ipc'
import { SiteResolver } from 'platforms/services'

export const setup = function(ipc: MainIPC) {
  ipc.define('resolver.getMeta', async ({url}) => {
    return await SiteResolver.getMeta(url)
  })
  
  ipc.define('resolver.getChapter', async ({url}) => {
    return await SiteResolver.getChapter(url)
  })
}

