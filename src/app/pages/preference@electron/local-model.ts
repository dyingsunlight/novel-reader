import {BaseStoreState, Store as AppStore, PreferenceState, Services} from "app/app-model"

export interface ElectronPreference extends BaseStoreState{
  proxyIsEnable: boolean
  proxyProtocol: string
  proxyHost: string
  proxyPort: string
  proxyUsername: string
  proxyPassword: string
}

export interface Store extends AppStore {
  electronPreference: ElectronPreference
}

export {
  PreferenceState,
  Services
}
