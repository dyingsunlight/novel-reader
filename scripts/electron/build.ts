import * as fs from 'fs-extra'
import * as path from 'path'
import * as Packager from 'electron-packager'
import { npm, commandPromise } from '../utils/command'

(async function f() {
  process.env['NODE_ENV'] = 'production'
  const projectRoot = path.resolve(__dirname, '../../')
  const baseBuildingDir = path.resolve(projectRoot, './.build/electron')
  console.log(`Build Info: \nBase Directory: ${baseBuildingDir} \nCurrent Project Root: ${baseBuildingDir}`)
  //
  //
  console.info('Compiling Base NPM Distribution ....')
  await fs.ensureDir(baseBuildingDir)
  
  await commandPromise('tsc','-p ./src/tsconfig-platforms.json --outDir ./.build/electron'.split(' '))
  await commandPromise('tscpaths','-p src/tsconfig-platforms --src src -o ./.build/electron'.split(' '))
  await commandPromise('ts-node','./scripts/app/build.ts --target=electron --out-dir=./.build/electron/platforms/electron/app'.split(' '))

  fs.copyFileSync(path.resolve(__dirname, 'package.json'), path.resolve(baseBuildingDir, 'package.json'))
  fs.copyFileSync(path.resolve(projectRoot, '.npmrc'), path.resolve(baseBuildingDir, '.npmrc'))
  fs.copyFileSync(path.resolve(projectRoot, 'license.md'), path.resolve(baseBuildingDir, 'license.md'))
  fs.copyFileSync(path.resolve(projectRoot, 'src/platforms/electron/development.env.json'), path.resolve(baseBuildingDir, 'platforms/electron/development.env.json'))
  fs.copyFileSync(path.resolve(projectRoot, 'src/platforms/electron/production.env.json'), path.resolve(baseBuildingDir, 'platforms/electron/production.env.json'))
  console.info('Copying assets .... Done.')
  //
  // Building
  await npm(['install', '--only=prod'], {cwd: baseBuildingDir})
  console.log('Start Electron Packager ... ')
  await Packager({
    dir: baseBuildingDir,
    platform: 'darwin',
    asar: false,
    osxSign: false,
    out: path.resolve(projectRoot, `dist/electron/${new Date().getTime()}`)
  })
  console.log('Start Electron Packager ... Done.')
})()
