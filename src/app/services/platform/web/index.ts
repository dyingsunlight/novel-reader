import request from './request'
import Translator from './translator'

export class WebService implements PlatformService {
  private readonly translator = new Translator()
  constructor() {
  }
  
  async translate(text: string, engine = 'youdao'): Promise<string> {
    this.translator.engine = engine
    return await this.translator.scheduleTranslate(text)
  }
  
  async audio(text: string): Promise<string> {
    const res = await request.post('/text/audio', {
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
    
    return request.url(`/text/audio?url=${encodeURIComponent(url)}`)
  }
}
