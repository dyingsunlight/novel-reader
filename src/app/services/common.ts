import {randomString, debounce, ExtendedPromiseAll, joinTextWithMarker} from "shared/utils"
import * as md5 from 'md5'
import * as EventEmitter from 'events'
import {Services} from "app/app-model"

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
  private readonly storage: Services.SessionStorage
  constructor(storage) {
    this.storage = storage
    this.init()
  }
  private async init() {
    const cachedSessionKeys = await this.storage.keys()
    cachedSessionKeys.forEach(async key => {
      this.cache[key] = await this.storage.getItem(key) || ''
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

function scheduleDispatchJobs(queue: Job[], translateHandler, { engine = 'youdao'}) {
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
        // Ensure Marker will not be translated
        marker = `${randomString(6, `1234567890`)}`
      }
      // Only last member no need add extra marker
      const fullText =  joinTextWithMarker(group.map(job => job.text), marker)
      
      for (let i = 0; i < group.length; i++) {
        group[i].stage = JobStage.running
      }
      const translatedText = await translateHandler(fullText, { engine, marker})
      const translatedTextFragments = translatedText.split(marker)
      
      for (let i = 0; i < group.length; i++) {
        group[i].translatedText = translatedTextFragments[i]
        group[i].stage = JobStage.finished
      }
      
      return group
    })
  }
  
  return ExtendedPromiseAll(finalResult, 3)
}

export class ScheduledTranslator {
  private readonly queue: Job[] = []
  private readonly events = new EventEmitter()
  private readonly scheduleHandler: Function
  private readonly translateDelegate: Function
  public engine
  private cached: TranslatorCache
  constructor({engine = 'youdao', translateDelegate, storageDelegate}) {
    this.engine = engine
    this.translateDelegate = translateDelegate
    this.cached = new TranslatorCache(storageDelegate)
    this.scheduleHandler = debounce(async () => {
      const options = {
        engine: this.engine,
      }
      await scheduleDispatchJobs(this.queue, this.translateDelegate, options)
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
  
  async translate(text: string, engine): Promise<string> {
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
