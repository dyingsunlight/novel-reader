import * as fs from 'fs-extra'
import * as path from 'path'
import { npm, commandPromise } from '../utils/command'

(async function f() {
  process.env['NODE_ENV'] = 'production'
  const projectRoot = path.resolve(__dirname, '../../')
  const baseBuildingDir = path.resolve(projectRoot, './.build/electron')
  await fs.ensureDir(baseBuildingDir)
  await commandPromise('tsc','-p ./src/tsconfig-platforms.json --outDir ./dist/web'.split(' '))
  await commandPromise('tscpaths','-p src/tsconfig-platforms --src src -o ./dist/web'.split(' '))
  await commandPromise('ts-node','./scripts/app/build.ts --target=web --out-dir=./dist/web/platforms/web/app'.split(' '))
})()
