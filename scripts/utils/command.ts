import {spawn} from "child_process"
import * as path from "path"
import { debounce } from "./debounce"

export const commandPromise = function (command, args, options?) {
  return new Promise(resolve => {
    const handler = spawn(command, args, {
      cwd: path.resolve(__dirname, '../../'),
      env: {
        "PATH": process.env["PATH"],
      },
      shell: false,
      detached: false,
      ...(options || {})
    })
    
    let messageStack: {text: string, type: keyof Console}[] = []
    const printAndClearMessageStack = debounce(() => {
      console.group(`${command} ${args.join(' ')} :\n`)
      messageStack.forEach(msg => console[msg.type](msg.text))
      console.groupEnd()
      messageStack = []
    }, 500, 3000)
  
    handler.stdout.on('data', function (data) {
      messageStack.push({text: data.toString(), type: 'info'})
      printAndClearMessageStack()
    })
  
    handler.stderr.on('data', function (data) {
      messageStack.push({text: data.toString(), type: 'error'})
      printAndClearMessageStack()
    })
    
    handler.on('exit', resolve)
  })
}

export function command(command, args, options) {
  const handler = spawn(command, args, {
    cwd: path.resolve(__dirname, '../../'),
    stdio: 'pipe',
    env: {
      "PATH": process.env["PATH"],
    },
    shell: false,
    detached: false,
    ...(options || {})
  })
  
  let messageStack: {text: string, type: keyof Console}[] = []
  const printAndClearMessageStack = debounce(() => {
    console.group(`${command} ${args.join(' ')}`)
    messageStack.forEach(msg => console[msg.type](msg.text))
    console.groupEnd()
    messageStack = []
  }, 500, 3000)
  
  handler.stdout.on('data', function (data) {
    messageStack.push({text: data.toString(), type: 'info'})
    printAndClearMessageStack()
  })
  
  handler.stderr.on('data', function (data) {
    messageStack.push({text: data.toString(), type: 'error'})
    printAndClearMessageStack()
  })
  
  return handler
}

export const npm = function (args, options = {}) {
  let npmCommand
  if (/^win/.test(process.platform)) {
    npmCommand = 'npm.cmd'
  } else {
    npmCommand = 'npm'
  }
  return commandPromise(npmCommand, args, options)
}
