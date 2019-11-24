import {Services} from "app/app-model"
import ipc from './library/ipc'

export class SessionStorage implements Services.SessionStorage {
  private readonly prefix: string = ''
  constructor(prefix = '') {
    if (!prefix) throw new Error('Storage prefix must be specified!')
    this.prefix = prefix
  }
  async getItem(key) {
    return <string>(await ipc.invoke('sessionStorage.getItem', {prefix: this.prefix, key}))
  }
  async setItem(key, value) {
    await ipc.invoke('sessionStorage.setItem', {prefix: this.prefix, key: key, value})
  }
  async removeItem(key) {
    await ipc.invoke('sessionStorage.removeItem', {prefix: this.prefix, key})
  }
  async sizes() {
    return <number>(await ipc.invoke('sessionStorage.sizes', {prefix: this.prefix}))
  }
  async keys() {
    return <string[]>(await ipc.invoke('sessionStorage.keys', {prefix: this.prefix}))
  }
  async clear() {
    await ipc.invoke('sessionStorage.clear', {prefix: this.prefix})
  }
}

export class LocalStorage implements Services.LocalStorage {
  private readonly prefix: string = ''
  constructor(prefix = '') {
    if (!prefix) throw new Error('Storage prefix must be specified!')
    this.prefix = prefix
  }
  async getItem(key) {
    return <string>(await ipc.invoke('localStorage.getItem', {prefix: this.prefix, key}))
  }
  async setItem(key, value) {
    await ipc.invoke('localStorage.setItem', {prefix: this.prefix, key: key, value})
  }
  async removeItem(key) {
    await ipc.invoke('localStorage.removeItem', {prefix: this.prefix, key})
  }
  async sizes() {
    return <number>(await ipc.invoke('localStorage.sizes', {prefix: this.prefix}))
  }
  async keys() {
    return <string[]>(await ipc.invoke('localStorage.keys', {prefix: this.prefix}))
  }
  async clear() {
    await ipc.invoke('localStorage.clear', {prefix: this.prefix})
  }
}
