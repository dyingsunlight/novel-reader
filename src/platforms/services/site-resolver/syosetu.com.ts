import * as Cheerio from 'cheerio'
import {FileCache} from '../controllers'
import {NovelServices} from "novel-model"
import {FILE_CACHE_ALIVE_TIME} from "./constants"
import Request from "./request"
import * as MD5 from 'md5'

export class SyosetuResolver implements NovelServices.RuleResolver {
  public readonly domain = 'ncode.syosetu.com'
  private readonly regexp: RegExp = /ncode\.syosetu\.com\/([^\/]+)\/?([^\/]+)?\/?/i
  constructor() {
  }
  
  test(url: string) {
    return this.regexp.test(url)
  }
  
  private parseURL(url: string) {
    if (!this.test(url)) return {}
    const [full, novelId, chapterId] = this.regexp.exec(url)
    return {
      novelId,
      chapterId
    }
  }
  
  private getCachePath(novelId: string, section: string = '') {
    if (section === 'meta') {
      return `${this.domain}/${novelId}/meta.json`
    } else {
      return `${this.domain}/${novelId}/${section}.txt`
    }
  }
  
  async getMeta(url: string) {
    const {novelId, chapterId} = this.parseURL(url)
    if (!novelId) return
    const novelHomePage = `http://ncode.syosetu.com/${novelId}/`
    
    const cachedMeta = await FileCache.get(this.getCachePath(novelId, 'meta'), FILE_CACHE_ALIVE_TIME)
    if (cachedMeta) return cachedMeta
  
    //
    // Fetch and parse content
    //
    
    // Fetch
    const response = await Request.get(novelHomePage, {})
    if (!response || response.status !== 200) {
      throw new Error('Request fail')
    }
    //
    //
    
    const $ = Cheerio.load(response.data, {decodeEntities: false})
    const title = $('#novel_color .novel_title').text()
    const contents: NovelServices.ContentsItem[] = []
    let lastContent: NovelServices.ContentsItem
    let isLastContentSaved = false
  
    $('#novel_color .index_box > *').each(function () {
      const $el = $(this)
      let item: NovelServices.ContentsItem = {
        title: '',
        url: ''
      }
      if ($el.hasClass('chapter_title')) {
        item.title = $el.text()
        item.children = []
        lastContent = item
        contents.push(item)
        isLastContentSaved = true
      } else {
        if (!lastContent) {
          lastContent = {
            url: null,
            title: 'No Category',
            children: []
          }
        }
        item.title = $el.find('.subtitle').text()
        item.updated = $el.find('.long_update > span[title]').attr('title')
        item.created = $el.find('.long_update ').text()
        item.url = 'https://ncode.syosetu.com' + $el.find('.subtitle a').attr('href')
        lastContent.children.push(item)
        isLastContentSaved = false
      }
    })
    
    if (!isLastContentSaved && lastContent) {
      contents.push(lastContent)
    }
  
    const meta: NovelServices.Meta = {
      title,
      id: MD5(novelHomePage),
      authors: [$('#novel_color .novel_writername a').text()],
      description: $('#novel_ex').text(),
      publishers: ['ncode.syosetu.com'],
      url: novelHomePage,
      subtitle: '',
      prefix: '',
      suffix: '',
      contents: contents
    }
    const result =  JSON.stringify(meta)
    await FileCache.set(`${this.domain}/${novelId}/meta.json`, result)
    return result
  }
  
  async getChapter(url: string) {
    if (!this.test(url)) return
    const {novelId, chapterId} = this.parseURL(url)
    if (!novelId || !chapterId) return

    const cachedMeta = await FileCache.get(this.getCachePath(novelId, chapterId), FILE_CACHE_ALIVE_TIME)
    if (cachedMeta) return cachedMeta
  
    const novelPageURL = `http://ncode.syosetu.com/${novelId}/${chapterId}/`
    
    const response = await Request.get(novelPageURL, {})
    if (!response || response.status !== 200) {
      throw new Error('Request fail')
    }
  
    const $ = Cheerio.load(response.data, {decodeEntities: false})
    const content = $('#novel_honbun').text()
    await FileCache.set(this.getCachePath(novelId, chapterId), content)
    return content
  }
}
