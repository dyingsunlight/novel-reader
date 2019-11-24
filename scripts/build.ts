import * as Bundler from 'parcel-bundler'
import * as path from 'path'
import loadEntries from './utils/entries'
import normalizeArgument from './utils/normalize-argv'

const sourcePath = path.resolve(__dirname, '../src/app/pages')

const options = {
  sourceMaps: false,
  productionL: true,
  outDir: './dist/buid-test',
  publicUrl: './',
  logLevel: 3,
  minify: true,
  hmr: false
}

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
  const target = args.target || 'all'
  const entries = loadEntries(sourcePath)
  console.log('Development server is listening at:')
  console.info('Building file detected:\n\n', entries.map(path => '    ' + path).join(('\n')))
  console.log('\n\n')
  await parcelBuild(entries, options)
})()
