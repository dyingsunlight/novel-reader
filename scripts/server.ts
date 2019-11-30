import normalizeArgument from "./utils/normalize-argv"

const Bundler = require('parcel-bundler');
const path = require('path');
const express = require('express');
import loadEntries from './utils/entries'


const app = new express()
const port = process.env.DEVELOPMENT_PORT || 10007
const sourcePath = path.resolve(__dirname, '../src/app/pages')

const options = {
  outDir: './dist',
  publicUrl: '/',
  logLevel: 3,
}

;(async function() {
  const args = normalizeArgument(process.argv)
  const target = args.target || process.env['TARGET_PLATFORM'] ||'all'
  const entries = loadEntries(sourcePath)
  console.log('Current Target: ', target, '\n')
  console.group('Development server is listening at:', entries)
  entries.forEach(entry => {
    console.log(`http://localhost:${port}${entry.in.slice(sourcePath.length).split(path.sep).join('/')}`)
  })
  console.groupEnd()
  const bundler = new Bundler(entries.map(entry => entry.in), options);
  app.use(bundler.middleware());
  app.listen(port);
  

})();
