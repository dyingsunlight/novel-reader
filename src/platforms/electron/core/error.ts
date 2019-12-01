import {App} from "electron"
import CreateWindow from "./window"
import { v1 as uuid } from 'uuid'
import { add as addMessage } from '../ipc-events/messages'

export function setup() {
  const errorHandler = error => {
    console.log(' get handle error')
    const id = uuid()
    addMessage({
      id,
      type: 'error',
      text: [error.message, error.stack],
      title: 'Error'
    })
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
  }
  process.on('unhandledRejection', errorHandler)
  process.on('uncaughtException', errorHandler)
}
