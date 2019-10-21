const Bundler = require('parcel-bundler');
const path = require('path');
const fs = require('fs')
const express = require('express');


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
  
  const entries = fs
    .readdirSync(sourcePath)
    .reduce((prev, name) => {
      
      const sourceScriptPath = path.resolve(sourcePath, name, 'index.ts')
      if (!fs.existsSync(sourceScriptPath) || !fs.statSync(sourceScriptPath).isFile() ) {
        return prev
      }
      
      const indexTemplateFilename = path.resolve(sourcePath, name, 'index')
      const sourceTemplateFilename = path.resolve(sourcePath, name, 'template')
      const templatePath = [
        ...(['.hbs', '.handlebar', '.pug', '.html'].map(suffix => indexTemplateFilename + suffix)),
        ...(['.hbs', '.handlebar', '.pug', '.html'].map(suffix => sourceTemplateFilename + suffix)),
      ].find(fs.existsSync)
      
      if (!templatePath) {
        throw new Error('Template not found for ' + sourceScriptPath)
      }
      
      prev.push(templatePath)
      
      return prev
    }, [])
  
  console.group('Development server is listening at:')
  entries.forEach(entry => {
    console.log(`http://localhost:${port}${entry.slice(sourcePath.length)}`)
  })
  
  console.groupEnd()
  const bundler = new Bundler(entries, options);
  app.use(bundler.middleware());
  app.listen(port);
  

})();
