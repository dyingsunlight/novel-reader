import * as fs from "fs-extra"
import * as path from "path"

export default function (sourcePath) {
  return fs
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
}
