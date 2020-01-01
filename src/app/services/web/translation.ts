import request from "./library/request"
import { SessionStorage } from "./storage"
import {Services} from "app/app-model"
import { ScheduledTranslator } from "../common"

async function translate(text: string, { engine = 'youdao', marker = ''} = {}) {
  const res = await request.post('/api/text/translation', {
    engine,
    marker,
    // Translation Params
    params: {
      text,
      to: 'zh-CN',
      com: true
    }
  })
  
  if (res.status !== 200) {
    console.error(res)
    throw new Error("network error")
  }
  
  return res.data
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
    const res = await request.post('/api/text/audio', {
      engine: 'baidu',
      params: {
        text,
        com: true
      }
    })
    
    if (res.status !== 200) {
      console.error(res)
      throw new Error("network error")
    }
    
    const url = res.data
    
    return request.url(`/api/text/audio?url=${encodeURIComponent(url)}`)
  }
}
