import { PATH } from './constants'
import * as path from 'path'
import * as fs from 'fs-extra'
// import {WriteStream} from "fs"

const date = new Date()
const day = date.getDay()
const month = date.getMonth()
const year = date.getFullYear()
const hours = date.getHours()
const minutes = date.getMinutes()
const seconds = date.getSeconds()
const directory = path.resolve(PATH.DATA, `logs/${year}-${month}-${day}-${hours}-${minutes}-${seconds}/`)

fs.ensureDirSync(directory)

const steam = fs.createWriteStream(path.resolve(directory,  'default.log'))
class Logger {
  protected logLevel = 4
  protected readonly filename: string
  // protected readonly writeToFileHandler
  // protected steam: WriteStream

  constructor(name: string) {
    // this.filename = 'default.log'
    // const filename = this.filename
    this.filename = name
    // this.steam = fs.createWriteStream(path.resolve(directory, filename))
  }
  
  public verbose(...msg) {
    if (this.logLevel === 4) {
      this.writeToFile(msg, 'Verbose')
      console.log(...msg)
    }
  }
  
  public log(...msg) {
    this.writeToFile(msg, 'Log')
    console.log(...msg)
  }
  
  public error(...msg) {
    this.writeToFile(msg, 'Error')
    console.error(...msg)
  }
  
  public info(...msg) {
    this.writeToFile(msg, 'Info')
    console.info(...msg)
  }
  
  public warn(...msg) {
    this.writeToFile(msg, 'Warn')
    console.info(...msg)
  }
  
  protected writeToFile(messages: string[], type = 'log') {
    const filename = this.filename
    messages.forEach(msg => steam.write(`[${filename}][${type}]${msg}\n`))
  }
  
  
}

export default Logger
