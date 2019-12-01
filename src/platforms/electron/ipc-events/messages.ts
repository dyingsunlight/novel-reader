import { MainIPC } from '../core/ipc'

type Message = { id: string, text: string[], type: string, title?: string }

const messages: Message[] = []
export const setup = function(ipc: MainIPC) {
  ipc.define('messages.get', async ({id}) => {
    const index = messages.findIndex(msg => msg.id === id)
    const msg = messages[index]
    return JSON.stringify(msg)
  })
}

export const add = (msg: Message) => {
  messages.push(msg)
}
