import Axios from 'axios'
import * as Cheerio from 'cheerio'
import {FileCache} from '../controllers'
import {FILE_CACHE_ALIVE_TIME} from './constants'
import {NovelServices} from "novel-model"
import Request from "./request"
import * as MD5 from 'md5'

export class KakuyomuJpResolver implements NovelServices.RuleResolver {
  public readonly domain = 'kakuyomu.jp'
  private readonly regexp: RegExp = /kakuyomu\.jp\/works\/[^\/]+\/?/i

  constructor() {}
  
  test(url: string) {
    return this.regexp.test(url)
  }
  
  private parseURL(url: string) {
    if (!this.test(url)) return {}
    const [full, novelId, chapterId] = /kakuyomu\.jp\/works\/([^\/]+)\/episodes\/?([^\/]+)\/?/ig.exec(url) || /kakuyomu\.jp\/works\/([^\/]+)\/?/i.exec(url)
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
  
    const cachedMeta = await FileCache.get(this.getCachePath(novelId, 'meta'), FILE_CACHE_ALIVE_TIME)
    if (cachedMeta) return cachedMeta
  
    const novelHomePage = `http://kakuyomu.jp/works/${novelId}`
    
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
    const title = $('#workTitle').text()
    const contents: NovelServices.ContentsItem[] = []
    let lastContent: NovelServices.ContentsItem
    let isLastContentSaved = false
    const resolver = this
    $('#table-of-contents ol.widget-toc-items > li').each(function () {
      const $el = $(this)
      let item: NovelServices.ContentsItem = {
        title: '',
        url: ''
      }
      if ($el.hasClass('widget-toc-chapter')) {
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
        item.title = $el.find('span.widget-toc-episode-titleLabel').text()
        item.created = $el.find('time.widget-toc-episode-datePublished').attr('datetime')
        item.url = resolver.domain + $el.find('> a').attr('href')
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
      authors: [$('#workAuthor-activityName').text()],
      description: $('#introduction').text(),
      publishers: [ this.domain ],
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
    
    const novelFrontMatterURL = `http://${this.domain}/works/${novelId}/episodes/${chapterId}`
    
    const response = await Request.get(novelFrontMatterURL, {})
    if (!response || response.status !== 200) {
      throw new Error('Request fail')
    }
    
    const $ = Cheerio.load(response.data, {decodeEntities: false})
    const content = $('.widget-episode-inner').text()
    await FileCache.set(this.getCachePath(novelId, chapterId), content)
    return content
  }
}
