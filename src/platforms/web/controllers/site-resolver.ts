import { SiteResolver } from 'platforms/services'

export default {
  
  async getMeta(forURL: string) {
    return await SiteResolver.getMeta(forURL)
  },
  
  async getChapter(forURL: string) {
    return SiteResolver.getChapter(forURL)
  }
}
