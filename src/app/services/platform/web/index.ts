import request from './request'

export class WebService implements PlatformService {
  constructor() {
  }
  
  async translate(text: string, engine = 'youdao'): Promise<string> {
    const res = await request.post('/text/translation', {
      engine,
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
