import { getMessage } from 'app/services/electron/messages'

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async function () {
  const message = await getMessage(id)
  const containerEl = document.querySelector('#message') as HTMLTextAreaElement
  containerEl.innerHTML = message.text.join('<br /><br />')
})
