export class SessionCache {
  private readonly prefix: string = ''
  private readonly indexesKey = 'indexes'
  private readonly splitChar = ';'
  
  constructor(prefix = '') {
    this.prefix = prefix
  }
  
  private getItemKey(key): string {
    return [this.prefix, key].join(':')
  }
  
  private getIndexesItemKey(): string {
    return [this.prefix, this.indexesKey].join(':')
  }
  
  getItem(key: string): string | void {
    return window.sessionStorage.getItem(this.getItemKey(key))
  }
  
  setItem(key, value): void {
    if (key.includes(this.splitChar)) {
      throw new Error('Key should not include split character of ' + this.splitChar)
    }
    
    const indexesKey = this.getIndexesItemKey()
    if (key === indexesKey) {
      throw new Error('Key should be indexes key: ' + indexesKey)
    }
    
    const indexes = this.keys()
    indexes.push(key)
    
    const prefixedKey = this.getItemKey(key)
    window.sessionStorage.setItem(indexesKey, indexes.join(this.splitChar))
    window.sessionStorage.setItem(prefixedKey, value)
  }
  
  keys(): string[] {
    return (window.sessionStorage.getItem(this.getIndexesItemKey()) || '').split(this.splitChar)
  }
}

