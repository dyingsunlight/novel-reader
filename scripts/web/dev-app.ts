import { commandPromise } from '../utils/command'

(async function f() {
  process.env['NODE_ENV'] = 'production'
  await commandPromise('ts-node','./scripts/app/server.ts --target=web'.split(' '), {
    env: {
      "PATH": process.env["PATH"],
      'DEVELOPMENT_PORT': '10007',
      'WEB_BACKEND_HOST': 'http://127.0.0.1:10009',
      'PLATFORMS_SERVICE_PROXY_ENABLE': 'true'
    }
  })
})()
