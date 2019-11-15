import Database from "./database"
import FileStorage from './storage'

export const FileCache = {
  async set(path: string, content: string) {
    const filename = `file-cache/${path}`
    await FileStorage.saveFile(filename, content)
    await Database.updateFileCache(path, filename)
  },

  async setByStream(path: string, stream: NodeJS.ReadableStream) {
    const filename = `file-cache/${path}`
    await FileStorage.saveFileStream(filename, stream)
    await Database.updateFileCache(path, filename)
  },
  
  async get(path: string, expiredTime: number = null) {
    const cache = await Database.findFileCache(path)
    if (!cache) return
    const {url, created} = cache
  
    if (expiredTime !== null) {
      const willExpiredIn = new Date(created).getTime() + expiredTime
      const isExpired = willExpiredIn < Date.now()
      if (isExpired) {
        return
      }
    }
    return await FileStorage.getFileContent(url)
  },
  
  async getAsStream(path: string) {
    const {url} = await Database.findFileCache(path)
    return FileStorage.getFileStream(url)
  }
  
}
