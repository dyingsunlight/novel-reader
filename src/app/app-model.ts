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
}

export enum StorageNames {
  ReaderState = 'cached-reader',
  preference = 'preference',
  readerCache = 'reader-cache',
  persistence = 'persistence',
  sessionPersistence = 'session-persistence',
}
