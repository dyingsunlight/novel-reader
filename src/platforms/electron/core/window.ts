import {BrowserWindow, BrowserWindowConstructorOptions} from "electron"
import * as Querystring from 'querystring'
import * as path from "path"
import * as url from 'url'

export default function createWindow(name, windowOptions: BrowserWindowConstructorOptions = {} ,{query = {}} = {}): BrowserWindow {
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
    window.webContents.openDevTools()
    window.loadURL(url.format({
      pathname: path.resolve(__dirname, `../app/${name}/index.html`),
      protocol: 'file:',
      slashes: true,
      query: query
    }))
  } else {
    const port = process.env.DEVELOPMENT_PORT || 10007
    window.webContents.openDevTools()
    window.loadURL(`http://127.0.0.1:${port}/${name}/index.html?${Querystring.stringify(query || {})}`)
  }
  
  return window
}
