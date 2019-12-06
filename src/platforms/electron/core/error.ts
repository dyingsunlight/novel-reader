import CreateWindow from "./window"
import { v1 as uuid } from 'uuid'
import { add as addMessage } from '../ipc-events/messages'
import * as path from 'path'
import * as fs from 'fs-extra'

export function setup() {
  const date = new Date()
  const day = date.getDay()
  const mounth = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const logFileName = `${year}-${mounth}-${day}-${hours}-${minutes}-${seconds}.log`
  const directory = path.resolve(__dirname, '../../../../.data/logs')
  fs.ensureDirSync(path.resolve(directory))
  const errorHandler = error => {
    try {
      const steam = fs.createWriteStream(path.resolve(directory, logFileName))
      const id = uuid()
      const msg = {
        id,
        type: 'error',
        text: [error.message, error.stack],
        title: 'Error'
      }
      steam.write(JSON.stringify(msg))
      steam.close()
      addMessage(msg)
      const win = CreateWindow('error-dialog@electron', {
        minWidth: 600,
        minHeight: 400,
        width: 600,
        height: 400,
        alwaysOnTop: true,
        modal: true,
        resizable: false,
        movable: true,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        skipTaskbar: false,
        title: 'Error'
      }, {
        query: {
          id
        }
      })
      win.setMenu(null)
    } catch (e) {
      return e
    }
  }
  process.on('unhandledRejection', errorHandler)
  process.on('uncaughtException', errorHandler)
}
