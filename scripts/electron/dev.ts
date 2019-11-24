import * as fs from 'fs-extra'
import * as path from 'path'
import * as Electron from 'electron'
import * as Chokidar from 'chokidar'
import * as TreeKill from 'tree-kill'
import { debounce } from '../utils/debounce'
import { npm, command, commandPromise } from '../utils/command'
import normalizeArgument from "../utils/normalize-argv"

(async function f() {
  const args = normalizeArgument(process.argv)
  
  const projectRoot = path.resolve(__dirname, '../../')
  const baseBuildingDir = path.resolve(projectRoot, 'dist/host/platforms/electron')
  
  await fs.ensureDir(baseBuildingDir)
  fs.copyFileSync(path.resolve(projectRoot, 'src/platforms/electron/development.env.json'), path.resolve(baseBuildingDir, 'development.env.json'))
  fs.copyFileSync(path.resolve(projectRoot, 'src/platforms/electron/production.env.json'), path.resolve(baseBuildingDir, 'production.env.json'))

  await npm(['run', 'build:platforms'], {
    cwd: projectRoot,
  })
  
  const watcher = Chokidar.watch('./platforms/**/*.ts', {
    cwd: path.resolve(projectRoot, 'src'),
    // usePolling: true,
    interval: 1000
  })
  if (args['auto-reload']) {
    let isRecompiling = false
    let isChangedWhenCompiling = false
    let childProcess = null
    const debounceToRecompile = debounce(async () => {
      if (isRecompiling) {
        isChangedWhenCompiling = true
      }
      isRecompiling = true
      await npm(['run', 'build:platforms'], {
        cwd: projectRoot,
      })
      isRecompiling = false
      if (isChangedWhenCompiling) {
        isChangedWhenCompiling = false
        return debounceToRecompile()
      }
    
      if (childProcess) {
        TreeKill(childProcess.pid)
      }
      childProcess = command(Electron, ['./dist/host/platforms/electron/main.js'], {
        cwd: projectRoot,
        env: {
          "PATH": process.env["PATH"],
          'DEVELOPMENT_PORT': '10012',
          "ELECTRON_ENV_FILE": 'development.env.json'
        }
      })
    }, 2000)
    watcher.on('change', function () {
      debounceToRecompile()
    })
    debounceToRecompile()
  } else {
    await npm(['run', 'build:platforms'], {
      cwd: projectRoot,
    })
  }
})()
