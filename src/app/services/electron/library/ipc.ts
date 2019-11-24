import {v1 as uuid} from "uuid"
const { ipcRenderer } = window.require('electron')

class RendererIPC {
  async invoke(event: string, data: any) {
    return new Promise((resolve ,reject) => {
      const reply = `ipc-reply:${event}:${uuid()}`
      ipcRenderer.once(reply, (_, { error, data  }) => {
        if (error) {
          console.error(error)
          reject(error)
        } else {
          resolve(data)
        }
      })
      ipcRenderer.send(event, { data, reply })
    })
  }
}

export default new RendererIPC()
