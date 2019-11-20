import {Services} from "app/app-model"

class BaseStorage {
  public readonly prefix: string = ''
  public readonly indexesKey = 'indexes'
  public readonly keySeparator = ';'
  public readonly storageEngine: Storage
  public readonly prefixSeparator = ':'
  
  constructor(prefix = '', engine: Storage) {
    this.prefix = prefix
    this.storageEngine = engine
  }
  
  private getItemKey(key) {
    return [this.prefix, key].join(this.prefixSeparator)
  }
  
  private getIndexesItemKey() {
    return [this.prefix, this.indexesKey].join(this.prefixSeparator)
  }
  
  getItem(key: string) {
    return this.storageEngine.getItem(this.getItemKey(key))
  }
  
  setItem(key, value): void {
    if (key.includes(this.keySeparator)) {
      throw new Error('Key should not include split character of ' + this.keySeparator)
    }
    
    const indexesKey = this.getIndexesItemKey()
    if (key === indexesKey) {
      throw new Error('Key should not be indexes key: ' + indexesKey)
    }
    
    const indexes = this.keys()
    const existedIndex = indexes.indexOf(key)

    if (~existedIndex) {
      indexes.splice(existedIndex, 1)
    }
    indexes.unshift(key)
    const prefixedKey = this.getItemKey(key)
    this.storageEngine.setItem(indexesKey, indexes.join(this.keySeparator))
    this.storageEngine.setItem(prefixedKey, value)
  }
  
  keys(): string[] {
    return (this.storageEngine.getItem(this.getIndexesItemKey()) || '').split(this.keySeparator)
  }
  
  removeItem(key) {
    const realKey = this.getItemKey(key)
    const newKeys = this.keys().filter(key => key === key)
    this.setItem(this.getIndexesItemKey(), newKeys.join(this.keySeparator))
    this.storageEngine.removeItem(realKey)
  }
  
  sizes() {
    const keys = this.keys()
    return keys.reduce((sum, key) => {
      const content = this.getItem(key) || ''
      return content.length + sum
    }, 0)
  }
  
  clear() {
    this.keys().forEach(key => {
      const realKey = this.getItemKey(key)
      this.storageEngine.removeItem(realKey)
    })
    this.storageEngine.removeItem(this.getIndexesItemKey())
  }
}

export class SessionStorage implements Services.SessionStorage {
  private readonly baseStorage: BaseStorage
  constructor(prefix = '') {
    this.baseStorage = new BaseStorage(prefix, window.sessionStorage)
  }
  async getItem(key) {
    return this.baseStorage.getItem(key)
  }
  async setItem(key, value) {
    this.baseStorage.setItem(key, value)
  }
  async removeItem(key) {
    this.baseStorage.removeItem(key)
  }
  async sizes() {
    return this.baseStorage.sizes()
  }
  async keys() {
    return this.baseStorage.keys()
  }
  async clear() {
    return this.baseStorage.clear()
  }
}

export class LocalStorage implements Services.LocalStorage {
  private readonly baseStorage: BaseStorage
  
  constructor(prefix = '') {
    this.baseStorage = new BaseStorage(prefix, window.localStorage)
  }
  async getItem(key) {
    return this.baseStorage.getItem(key)
  }
  async setItem(key, value) {
    this.baseStorage.setItem(key, value)
  }
  async removeItem(key) {
    this.baseStorage.removeItem(key)
  }
  async sizes() {
    return this.baseStorage.sizes()
  }
  
  async keys() {
    return this.baseStorage.keys()
  }
  async clear() {
    return this.baseStorage.clear()
  }
}
