import ipc from './library/ipc'
import { SessionStorage } from "./storage"
import {Services} from "app/app-model"
import { ScheduledTranslator } from "../common"

async function translate(text: string, { engine = 'youdao', marker = ''} = {}) {
  const options = {
    engine,
    marker,
  }
  const params = {
    text,
    to: 'zh-CN',
    com: true
  }
  
  return await ipc.invoke('translate', { params, options})
}

export class Translation implements Services.Translation {
  private readonly scheduleTranslator = new ScheduledTranslator({
    storageDelegate: new SessionStorage('T:'),
    translateDelegate: translate
  })
  
  async translate(text: string, engine): Promise<string> {
    return await this.scheduleTranslator.translate(text, engine)
  }
  async audio(text: string): Promise<string> {
    return ''
  }
}
