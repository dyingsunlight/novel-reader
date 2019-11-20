import {BaseStoreState, Store as AppStore, PreferenceState, Services} from "app/app-model"

export interface Collection extends BaseStoreState {
  items?: Services.ResolvedMeta[]
}

export interface VisitedLinks extends BaseStoreState {
  links?: { id: string, visitedTime?: string }[]
}

export interface ReaderState extends BaseStoreState {
  fullText?: string
  indicator?: number
  translatedTexts?: {[key: string]: string}
}

export interface Store extends AppStore {
  collection: Collection
  reader: ReaderState
}

export {
  PreferenceState,
  Services
}
