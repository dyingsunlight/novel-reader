import * as fs from 'fs-extra'
import * as path from 'path'
import * as Packager from 'electron-packager'
import { npm } from '../utils/command'

(async function f() {
  process.env['NODE_ENV'] = 'production'
  const projectRoot = path.resolve(__dirname, '../../')
  const baseBuildingDir = path.resolve(projectRoot, 'dist/electron')
  console.log(`Build Info: \nBase Directory: ${baseBuildingDir} \nCurrent Project Root: ${baseBuildingDir}`)
  //
  //
  console.info('Compiling Base NPM Distribution ....')
  await npm(['run', 'build:platforms'], {cwd: projectRoot})
  await npm(['run', 'build:electron-app'], {cwd: projectRoot})
  await fs.ensureDir(baseBuildingDir)
  fs.copySync(path.resolve(projectRoot, 'dist/host'), baseBuildingDir)
  fs.copyFileSync(path.resolve(__dirname, 'package.json'), path.resolve(baseBuildingDir, 'package.json'))
  fs.copyFileSync(path.resolve(projectRoot, '.npmrc'), path.resolve(baseBuildingDir, '.npmrc'))
  fs.copyFileSync(path.resolve(projectRoot, 'license.md'), path.resolve(baseBuildingDir, 'license.md'))
  fs.copyFileSync(path.resolve(projectRoot, 'src/platforms/electron/development.env.json'), path.resolve(baseBuildingDir, 'development.env.json'))
  fs.copyFileSync(path.resolve(projectRoot, 'src/platforms/electron/production.env.json'), path.resolve(baseBuildingDir, 'production.env.json'))
  console.info('Copying assets .... Done.')
  //
  // Building
  await npm(['install', '--only=prod'], {cwd: baseBuildingDir})
  console.log('Start Electron Packager ... ')
  await Packager({
    dir: baseBuildingDir,
    platform: 'darwin',
    asar: true,
    osxSign: false,
    out: path.resolve(projectRoot, `dist/electron-release/${new Date().getTime()}`)
  })
  console.log('Start Electron Packager ... Done.')
})()
