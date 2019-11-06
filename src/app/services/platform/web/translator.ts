import {randomString, debounce, ExtendedPromiseAll} from "../../../core/utils"
import request from "./request"
import * as md5 from 'md5'
import * as EventEmitter from 'events'
import { SessionCache } from "./cache"

enum JobStage {
  finished = 1,
  failed,
  running,
  pending
}

interface Job {
  identifier: string
  text: string
  translatedText?: string
  replyEvent: string
  stage: JobStage
}

class TranslatorCache {
  private readonly cache: {[key: string]: string} = {}
  private readonly storage = new SessionCache('T')
  constructor() {
    const cachedSessionKeys = this.storage.keys()
    cachedSessionKeys.forEach(key => {
      this.cache[key] = this.storage.getItem(key) || ''
    })
  }
  get(key) {
    return this.cache[key] || this.storage.getItem(key)
  }
  set(key, value) {
    this.storage.setItem(key, value)
    this.cache[key] = value
  }
}

const TRANSLATION_MAX_LENGTH = 1500

function scheduleDispatchJobs(queue: Job[], translateHandler) {
  const jobGroups: Job[][] = []
  const availableJobs = queue.filter(job => job.stage !== JobStage.finished)
  
  let i = 0
  let lengthAccumulated = 0
  let jobGroup: Job[] = []
  while(availableJobs[i]) {
    
    // Push job to current group
    let nextJob = availableJobs[i]
    lengthAccumulated += nextJob.text.length
    jobGroup.push(nextJob)
    
    // Create new one
    if (lengthAccumulated >= TRANSLATION_MAX_LENGTH) {
      lengthAccumulated = 0
      jobGroups.push(jobGroup)
      jobGroup = []
    }
  
    i++
  }
  
  if (jobGroup.length) {
    jobGroups.push(jobGroup)
  }
  
  const finalResult = []
  
  // Combine each group member text in to single translate request
  for (const group of jobGroups) {
    finalResult.push(async function () {
      let marker
      while (!marker || group.some(job => job.text.includes(marker))) {
        marker = `\n${randomString(4, '1234567890')}\n`
      }
      // Only last member no need add extra marker
      const fullText = group.reduce((prev, job, index) => prev + job.text + (index === group.length ? '' : marker), '')
  
      for (let i = 0; i < group.length; i++) {
        group[i].stage = JobStage.running
      }
  
      const translatedText = await translateHandler(fullText)
      
      const translatedTextFragments = translatedText.result.join('\n').split(marker)
  
      for (let i = 0; i < group.length; i++) {
        group[i].translatedText = translatedTextFragments[i]
        group[i].stage = JobStage.finished
      }
      
      return group
    })
  }
  
  return ExtendedPromiseAll(finalResult, 3)
}

export default class Translator {
  private readonly queue: Job[] = []
  private readonly events = new EventEmitter()
  private readonly scheduleHandler: Function
  public engine
  
  private cached = new TranslatorCache()

  constructor({engine = 'youdao'} = {}) {
    this.engine = engine
    this.scheduleHandler = debounce(async () => {
      await scheduleDispatchJobs(this.queue, this.translate.bind(this))
      this.queue.filter(job => {
        if (job.stage === JobStage.finished && job.translatedText) {
          this.cached.set(job.identifier, job.translatedText)
          this.events.emit(job.replyEvent, job.translatedText)
          return false
        }
        return true
      })
    }, 500, 2000)
  }

  private async translate(text: string): Promise<string> {
    const res = await request.post('/text/translation', {
      engine: this.engine,
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
  
  public async scheduleTranslate(text: string): Promise<string> {
    return new Promise(resolve => {
      const identifier = md5(text)
      
      const cachedTranslation = this.cached.get(identifier)
      if (cachedTranslation && typeof cachedTranslation=== 'string') {
        return resolve(cachedTranslation)
      }
      
      const isExistJob = this.queue.some(job => job.identifier === identifier)
      const replyEvent = `T:${identifier}`
      
      if (!isExistJob) {
        
        const job = {
          identifier,
          text,
          replyEvent,
          stage: JobStage.pending
        }
        
        this.queue.push(job)
      }
      
      this.events.once(replyEvent, resolve)
      
      return this.scheduleHandler()
    })
  }
}
