// Modules to control application life and create native browser window
import loadEnv from './library/env'
import * as path from 'path'

console.log('Using env file path', path.join(__dirname, process.env['ELECTRON_ENV_FILE'] || 'production.env.json'))
loadEnv(path.join(__dirname, process.env['ELECTRON_ENV_FILE'] || 'production.env.json'))

import {app, BrowserWindow, Menu} from 'electron'
import { setup as setupIPCEvents } from './ipc-events'
import { MainIPC } from "./library/ipc"

let mainWindow
async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 700,
    minHeight: 700,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
    }
  })
  
  mainWindow.webContents.on('new-window', async (event, navigationUrl) => {
    event.preventDefault()
  })
  
  if (process.env.NODE_ENV === 'production') {
    await mainWindow.loadFile(path.resolve(__dirname, './app/index.html'))
  } else {
    const port = process.env.DEVELOPMENT_PORT || 10007
    mainWindow.webContents.openDevTools()
  
    await mainWindow.loadURL(`http://127.0.0.1:${port}/reader/index.html`)
  }
  
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


setupIPCEvents(new MainIPC())

Menu.setApplicationMenu(null)
