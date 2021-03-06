// Modules to control application life and create native browser window
import loadEnv from './core/env'
import * as path from 'path'
loadEnv(path.join(__dirname, process.env['ELECTRON_ENV_FILE'] || 'production.env.json'))
import { app, BrowserWindow } from 'electron'
import { setup as setupIPCEvents } from './ipc-events'
import { MainIPC } from "./core/ipc"
import CreateWindow from './core/window'
import setupMenu from './core/menu'
import { setup as setupErrorHandler} from './core/error'


let mainWindow: BrowserWindow
const initializeMainWindow = async () => {
  if (mainWindow) return
  mainWindow = CreateWindow('reader', {
    minWidth: 700,
    minHeight: 700,
    width: 700,
    height: 700,
  })
  setupMenu(app, mainWindow)
}

app.on('ready', initializeMainWindow)
app.on('activate', initializeMainWindow)
app.on('window-all-closed', function () {
  app.quit()
})

setupErrorHandler()
setupIPCEvents(new MainIPC())

