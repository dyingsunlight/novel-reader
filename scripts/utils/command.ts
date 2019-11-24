import {spawn} from "child_process"
import * as path from "path"

export const commandPromise = function (command, args, options) {
  return new Promise(resolve => {
    const handler = spawn(command, args, {
      cwd: path.resolve(__dirname, '../'),
      env: {
        "PATH": process.env["PATH"],
      },
      customFds: [0,1,2],
      shell: false,
      detached: false,
      ...(options || {})
    })
    
    handler.stdout.on('data', function (data) {
      console.log(`(${command} ${args.join(' ')}):  ${data.toString()}`)
    })
    
    handler.stderr.on('data', function (data) {
      console.log(`(${command} ${args.join(' ')}):  ${data.toString()}`)
    })
    
    handler.on('exit', resolve)
  })
}

export function command(command, args, options) {
  const handler = spawn(command, args, {
    cwd: path.resolve(__dirname, '../'),
    env: {
      "PATH": process.env["PATH"],
    },
    customFds: [0,1,2],
    shell: false,
    detached: false,
    ...(options || {})
  })
  
  handler.stdout.on('data', function (data) {
    console.log(`(${command} ${args.join(' ')}):  ${data.toString()}`)
  })
  
  handler.stderr.on('data', function (data) {
    console.log(`(${command} ${args.join(' ')}):  ${data.toString()}`)
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
