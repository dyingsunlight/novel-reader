import {Module, Plugin, Store} from "vuex"
import {StorageNames, Store as AppStore} from "app/app-model"
import {LocalStorage, SessionStorage} from "app/services"
import {Services} from "app/app-model"
import {debounce} from "shared/utils"

const storageInstances: { [key: string]: Services.SessionStorage | Services.LocalStorage } = {}

function getStorageHandler(moduleName, storageEngine): Services.SessionStorage | Services.LocalStorage {
  const instanceKey = StorageNames.persistence + '-' + moduleName
  if (!storageInstances[instanceKey]) {
    const Engine = storageEngine === 'sessionStorage' ? SessionStorage : LocalStorage
    storageInstances[instanceKey] = new Engine(instanceKey)
  }
  return storageInstances[instanceKey]
}

async function saveToStorage(moduleName, storageEngine, data = {}) {
  const storage = getStorageHandler(moduleName, storageEngine)
  await storage.setItem('data', JSON.stringify(data))
}

async function getFromStorage(moduleName, storageEngine) {
  const storage = getStorageHandler(moduleName, storageEngine)
  return JSON.parse(await storage.getItem('data') || '{}')
}

function createDebounceSaveHandler(moduleName, storageEngine) {
  
  let isStateChangedDuringSaving = false
  let isSaving = false
  
  let internalData
  const debounceToSave = debounce(async () => {
    isStateChangedDuringSaving = false
    if (isSaving) {
      isStateChangedDuringSaving = true
      return
    }
    await saveToStorage(moduleName, storageEngine, internalData)
    isSaving = false
    if (isStateChangedDuringSaving) {
      debounceToSave()
    }
  })
  
  return (newValue) => {
    internalData = newValue
    debounceToSave()
  }
}

export default function (modules: { [key: string]: Module<any, null> }) {
  
  return function (store: Store<AppStore>): Plugin<AppStore> {
    
    for (let [name, module]  of Object.entries(modules)) {
      if (module.getters && module.getters['localStorage'] && (module.mutations['restoreLocalStorage'] || module.actions['restoreLocalStorage'])) {
        getFromStorage(name, 'localStorage').then(async data => {
          if (data) {
            if (module.actions['restoreLocalStorage']) {
              await store.dispatch(`${name}/restoreLocalStorage`, data)
            } else if (module.mutations['restoreLocalStorage']) {
              store.commit(`${name}/restoreLocalStorage`, data)
            }
          }
          
          store.watch((state, getters) => getters[`${name}/localStorage`], createDebounceSaveHandler(name, 'localStorage'), {deep: true})
          
          if (module.actions['finishJob']) {
            await store.dispatch(`${name}/finishJob`, 'plugin:local-storage')
          } else if (module.mutations['finishJob']) {
            store.commit(`${name}/finishJob`, 'plugin:local-storage')
          }
        })
      }
      
      if (module.getters && module.getters['sessionStorage'] && (module.mutations['restoreSessionStorage'] || module.actions['restoreSessionStorage'])) {
        getFromStorage(name, 'sessionStorage').then(async data => {
          
          if (data) {
            if (module.actions['restoreSessionStorage']) {
              await store.dispatch(`${name}/restoreSessionStorage`, data, { root: true })
            } else if (module.mutations['restoreSessionStorage']) {
              store.commit(`${name}/restoreSessionStorage`, data)
            }
          }
          
          store.watch((state, getters) => getters[`${name}/sessionStorage`], createDebounceSaveHandler(name, 'localStorage'), {deep: true})
          if (module.actions['finishJob']) {
            await store.dispatch(`${name}/finishJob`, 'plugin:session-storage', { root: true })
          } else if (module.mutations['finishJob']) {
            store.commit(`${name}/finishJob`, 'plugin:session-storage')
          }
        })
      }
    }
    return
  }
}
