import {ipcMain, webContents} from "electron"

export class MainIPC {
  private events: {event: string, handler: Function}[] = []
  define(event: string, handler: Function) {
    const exitedDefinition = this.events.find(item => item.event === event)
    if (exitedDefinition) {
      return new Error('Ipc event was defined in multi times')
    }
    this.events.push({
      event,
      handler: handler
    })
    ipcMain.on(`${event}`, async (e, {reply, data}) => {
      const senderId = e.sender.id
      let sender = webContents.fromId(senderId)
      await new Promise(resolve => setTimeout(resolve))
      let replyData
      try {
        replyData = await handler(data)
        sender.send(reply, { data: replyData })
      }catch (error) {
        console.error(error)
        sender.send(reply, { error })
        throw error
      }
    })
  }
}
