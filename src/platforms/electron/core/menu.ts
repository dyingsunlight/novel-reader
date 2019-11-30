import {Menu} from 'electron'
import CreateWindow from './window'

export default function setupMenu(app, mainWindow) {
  const template = [
    {
      label: 'Windows',
      submenu: [
        {
          label: 'Preference',
          click: async () => {
            if (!mainWindow) throw new Error('Parent window not found')
            const win = await CreateWindow('preference@electron', {
              minWidth: 500,
              minHeight: 500,
              width: 500,
              height: 600,
              parent: mainWindow,
              modal: true,
              resizable: false,
              movable: true,
              minimizable: false,
              maximizable: false,
              fullscreenable: false,
              skipTaskbar: true,
              title: 'Preference'
            })
            win.setMenu(null)
          }
        }
      ]
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
