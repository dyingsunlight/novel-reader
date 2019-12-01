import { commandPromise, command } from '../utils/command'

(async function f() {
  process.env['NODE_ENV'] = 'production'
  await commandPromise('ts-node','./scripts/app/server.ts --target=electron'.split(' '), {
    env: {
      "PATH": process.env["PATH"],
      'DEVELOPMENT_PORT': '10012',
      'TARGET_PLATFORM': 'electron'
    }
  })
})()
