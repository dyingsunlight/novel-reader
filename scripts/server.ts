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
//
// More Parcel API options see document.
// https://en.parceljs.org/api.html
;(async function() {
  
  const entries = loadEntries(sourcePath)
  console.group('Development server is listening at:')
  entries.forEach(entry => {
    console.log(`http://localhost:${port}${entry.slice(sourcePath.length)}`)
  })
  
  console.groupEnd()
  const bundler = new Bundler(entries, options);
  app.use(bundler.middleware());
  app.listen(port);
  

})();
