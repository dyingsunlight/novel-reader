import { Services } from "app/app-model"
import request from "./library/request"

export default class Resolver implements Services.Resolver {
  async getMeta(url: string) {
    const res = await request.get('/novel/meta', {
      params: {
        url
      }
    })
  
    if (res.status !== 200) {
      throw new Error("network error")
    }
    
    return res.data
  }
  
  async getChapter(url: string) {
    const res = await request.get('/novel/chapter', {
      params: {
        url
      }
    })
  
    if (res.status !== 200) {
      console.error(res)
      throw new Error("network error")
    }
  
    return res.data
  }
  
  async test() {
    return true
  }
}
