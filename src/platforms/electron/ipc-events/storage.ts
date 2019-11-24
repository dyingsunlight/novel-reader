import Database from '../database'
import { MainIPC } from '../library/ipc'

export const setup = function(ipc: MainIPC) {
  ipc.define('localStorage.setItem', async ({prefix, key, value}) => {
    const item = await Database.getStorageItem(prefix, key)
    if (item) {
      await Database.updateStoreItem(item.id, value)
    } else {
      await Database.addStorageItem(prefix, key, value)
    }
  })
  
  ipc.define('localStorage.getItem', async function ({prefix, key}) {
    const item = await Database.getStorageItem(prefix, key)
    return item && item.value
  })
  
  ipc.define('localStorage.removeItem', async function({prefix, key}) {
    await Database.removeStorageItem(prefix, key)
  })
  
  ipc.define('localStorage.keys', async function({prefix}) {
    return await Database.keysOfStorage(prefix)
  })
  
  ipc.define('localStorage.sizes', async function({prefix}) {
    return await Database.sizeOfStorage(prefix)
  })
  
  ipc.define('localStorage.clear', async function({prefix}){
    return await Database.removeStorage(prefix)
  })
  
  
  const sessionStorage: { [prefix: string]: { [key: string]: string}} = {}
  
  const initSessionStorageFor = prefix => {
    if (!sessionStorage[prefix]) {
      sessionStorage[prefix] = {}
    }
  }
  
  ipc.define('sessionStorage.setItem',  ({prefix, key, value}) => {
    initSessionStorageFor(prefix)
    sessionStorage[prefix][key] = value
  })
  
  ipc.define('sessionStorage.getItem', async ({prefix, key}) => {
    initSessionStorageFor(prefix)
    return sessionStorage[prefix][key]
  })
  
  ipc.define('sessionStorage.removeItem', async ({prefix, key}) => {
    initSessionStorageFor(prefix)
    delete sessionStorage[prefix][key]
  })
  
  ipc.define('sessionStorage.keys', async ({prefix}) => {
    initSessionStorageFor(prefix)
    return Object.keys(sessionStorage[prefix])
  })
  
  ipc.define('sessionStorage.sizes', async ({prefix}) => {
    return Object.values(sessionStorage[prefix]).reduce((sum, value) => sum + value.length, 0)
  })
  
  ipc.define('sessionStorage.clear', async ({prefix}) => {
    delete sessionStorage[prefix]
  })
  
}
