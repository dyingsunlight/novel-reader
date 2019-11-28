import * as fs from "fs-extra"
import * as path from "path"

interface FilePath {
  in: string
  out: string
}

export default function (sourcePath, normalizer ?: (name: string) => string) : FilePath[]{
  return fs
    .readdirSync(sourcePath)
    .reduce((prev: FilePath[], name) => {
      
      const folderPath = path.resolve(sourcePath, name)
      if (!fs.statSync(folderPath).isDirectory()) {
        return prev
      }
      
      let folderName = name
      if (normalizer) {
        folderName = normalizer(folderName)
        if (!folderName) {
          return prev
        }
      }
      
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
      
      prev.push({
        in: templatePath,
        out: folderName
      })
      
      return prev
    }, [])
}
