import {SyosetuResolver} from "./syosetu.com"
import { KakuyomuJpResolver } from "./kakuyomu.jp"
import {NovelServices} from "novel-model"

const rules: NovelServices.RuleResolver[] = [
  new KakuyomuJpResolver(),
  new SyosetuResolver()
]

class SiteResolver implements NovelServices.RuleResolver {
  public readonly domain = null
  
  test(url: string) {
    return rules.some(rule => rule.test(url))
  }
  async getMeta(url: string) {
    const resolver = rules.find(rule => rule.test(url))
    return await resolver.getMeta(url)
  }
  async getChapter(url: string): Promise<string | void> {
    const resolver = rules.find(rule => rule.test(url))
    return await resolver.getChapter(url)
  }
}

export default new SiteResolver
