import * as fs from 'fs-extra'
import * as path from 'path'
import { PATH } from "platforms/constants"
import {NovelServices} from "novel-model"

export default class LocalFilesStorage implements NovelServices.Storage {
  private root = path.resolve(PATH.DATA, process.env['STORAGE_LOCAL_PATH'] || './storage')
  
  constructor() {
    this.initialize()
  }
  
  private async getObject(filename): Promise<string> {
    const objectPath = path.resolve(this.root, filename)
    if (!fs.existsSync(objectPath)) return ''
    return fs.readFileSync(objectPath).toString('utf8')
  }
  private async saveObject(filename, body) {
    const objectPath = path.resolve(this.root, filename)
    fs.ensureDirSync(path.dirname(objectPath))
    return fs.writeFileSync(objectPath, body)
  }
  
  initialize() {
    console.log('Initializing Local file storage mode ...')
    fs.ensureDirSync(this.root)
  }
  
  async saveFile(path: string, content: string): Promise<NovelServices.FileURL|void> {
    await this.saveObject(path, content)
    return path
  }
  
  async getFileContent(path: string): Promise<string> {
    return await this.getObject(path)
  }
  
  saveFileStream(filename: string, stream): Promise<NovelServices.FileURL | void> {
    return new Promise((resolve, reject) => {
      const filePath = path.resolve(this.root, filename)
      fs.ensureDirSync(path.dirname(filePath))
      
      const dst = fs.createWriteStream(filePath)
      stream.pipe(dst)
      stream.on('end', function () {
        resolve(filename)
      })
      dst.on('error', function (err) {
        console.error(err)
        reject(err)
      })
    })
  }
  
  async getFileStream(filename) {
    const filePath = path.resolve(this.root, filename)
    return fs.createReadStream(filePath)
  }
}
