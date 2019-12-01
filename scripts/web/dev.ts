import * as path from 'path'
import * as Chokidar from 'chokidar'
import * as TreeKill from 'tree-kill'
import { debounce } from '../utils/debounce'
import { npm, command, commandPromise } from '../utils/command'
import normalizeArgument from "../utils/normalize-argv"

(async function f() {
  const args = normalizeArgument(process.argv)
  const projectRoot = path.resolve(__dirname, '../../')
  const watcher = Chokidar.watch('./platforms/**/*.ts', {
    cwd: path.resolve(projectRoot, 'src'),
    interval: 1000
  })
  let childProcess = null
  const runServer = async () => {
    if (childProcess) {
      TreeKill(childProcess.pid)
    }
    childProcess = command('ts-node', '--project ./src/tsconfig-platforms.json -r tsconfig-paths/register ./src/platforms/web/server.ts'.split(' '), {
      cwd: projectRoot,
      env: {
        "PATH": process.env["PATH"],
        'DEVELOPMENT_PORT': '10007',
        'WEB_BACKEND_HOST': '10009',
        'PLATFORMS_SERVICE_PROXY_ENABLE': 'true',
        'PLATFORMS_SERVICE_PROXY_PROTOCOL': 'http',
        'PLATFORMS_SERVICE_PROXY_HOST': '127.0.0.1',
        'PLATFORMS_SERVICE_PROXY_PORT': '1087'
      }
    })
  }
  const debounceRestart = debounce(runServer, 1000)
  if (args['auto-reload']) {
    console.log('Auto Reload was enabled')
    watcher.on('change', function () {
      debounceRestart()
    })
  }
  await runServer()
})()
