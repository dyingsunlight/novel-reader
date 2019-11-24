import { Services } from "app/app-model"
import ipc from './library/ipc'
import {NovelServices} from "novel-model"

export default class Resolver implements Services.Resolver {
  async getMeta(url: string) {
    const meta = <string|void>(await ipc.invoke('resolver.getMeta', {url}))
    return JSON.parse(meta || '{}') as NovelServices.Meta
  }
  
  async getChapter(url: string) {
    return <string|void>(await ipc.invoke('resolver.getChapter', {url}))
  }
  
  async test() {
    return true
  }
}
