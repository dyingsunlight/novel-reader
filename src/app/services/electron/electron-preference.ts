import ipc from './library/ipc'

// !!! Warning !!!
// This is a electron private IPC method!
export const update = async function(config) {
   await ipc.invoke('electron-preference.update', JSON.stringify(config))
}
