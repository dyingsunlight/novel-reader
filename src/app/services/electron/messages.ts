import ipc from './library/ipc'

// !!! Warning !!!
// This is a electron private IPC method!
export const getMessage = async function(id: string) {
  const data = <string | void>(await ipc.invoke('messages.get', {id}))
  if (data) {
    return JSON.parse(data)
  }
}
