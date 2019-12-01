import * as Bundler from 'parcel-bundler'
import * as path from 'path'
import loadEntries from '../utils/entries'
import normalizeArgument from '../utils/normalize-argv'

const sourcePath = path.resolve(__dirname, '../../src/app/pages')

const parcelBuild = async function (entries, options) {
  return new Promise((resolve, reject) => {
    const bundler = new Bundler(entries, options)
    bundler.bundle()
    bundler.on('bundled', function () {
      // @ts-ignore
      bundler.stop()
      resolve()
    })
    bundler.on('buildError', reject)
  })
};

(async function () {
  const args = normalizeArgument(process.argv)
  const target = args.target
  const outDir = args['out-dir'] || args['outDir']
  const entries = loadEntries(sourcePath)
  
  if (!target) {
    throw new Error('Missing required \'--target\' parameter to build app.')
  }
  
  if (!outDir) {
    throw new Error('Missing required \'--out-dir\' parameter to build app.')
  }
  
  Object.entries(args).forEach(([key, value]) => {
    process.env[key] = value
  })
  
  const options = {
    sourceMaps: false,
    production: true,
    outDir,
    cache: false,
    publicUrl: './',
  }
  
  console.log('Current Target: ', target)
  console.log('Development server is listening at:')
  console.info('Building file detected:\n\n', entries.map(path => `\n- Entry: ${path.in}\n- Output: ${path.out}`).join(('\n')))
  for (let p of entries) {
    await parcelBuild(p.in, Object.assign({}, options, {outDir: path.join(options.outDir, p.out)}))
  }
  
  process.exit(0)
})()
