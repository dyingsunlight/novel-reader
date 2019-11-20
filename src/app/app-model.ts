import {NovelServices} from "novel-model"

export interface BaseStoreState {
  finishedJobs?: string[]
}

export interface PreferenceState extends BaseStoreState{
  translationEngine ?: string
  translationEngines ?: string[]
  speakingEngine?: string
  speakingEngines?: string[]
  speakingRate?: number
  speakingPitch?: number
}

export interface CoreState extends BaseStoreState{
}

export interface Store {
  preference: PreferenceState
  core: CoreState
}

export enum StorageNames {
  persistence = 'persistence',
}

export namespace Services {
  
  export interface Meta extends NovelServices.Meta {}
  
  export interface ResolvedMeta extends Services.Meta {
    createdAt: string
    lastVisit: string
  }
  
  export abstract class Resolver {
    abstract getChapter(url: string): Promise<string| void>
    abstract getMeta(url: string): Promise<NovelServices.Meta|void>
    abstract test(url: string): Promise<Boolean>
  }
  
  export abstract class Translation {
    abstract translate(text: string, toLang: string): Promise<string>
    abstract audio(text: string): Promise<string>
  }
  
  abstract class Storage {
    
    abstract getItem(key: string): Promise<string>
    
    abstract setItem(key: string, value: string): Promise<void>
    
    abstract removeItem(key: string): Promise<void>
    
    abstract keys(): Promise<string[]>
    
    abstract sizes(): Promise<number>
  }
  
  export abstract class SessionStorage extends Storage {}
  
  export abstract class LocalStorage extends Storage {}
  
}
