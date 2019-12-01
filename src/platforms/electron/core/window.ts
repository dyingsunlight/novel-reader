import {BrowserWindow} from "electron"
import * as path from "path"

export default function createWindow(name, windowOptions = {}): BrowserWindow {
  const window = new BrowserWindow({
    minWidth: 400,
    minHeight: 400,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
    },
    ...windowOptions
  })
  
  window.webContents.on('new-window', async (event, navigationUrl) => event.preventDefault())
  
  if (process.env.NODE_ENV === 'production') {
    window.loadFile(path.resolve(__dirname, `../app/${name}/index.html`))
  } else {
    const port = process.env.DEVELOPMENT_PORT || 10007
    window.webContents.openDevTools()
    window.loadURL(`http://127.0.0.1:${port}/${name}/index.html`)
  }
  
  return window
}
