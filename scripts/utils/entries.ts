import * as fs from "fs-extra"
import * as path from "path"
import normalizeArgument from "../utils/normalize-argv"

interface FilePath {
  in: string
  out: string
}

export default function (sourcePath) : FilePath[]{
  const args = normalizeArgument(process.argv)
  const target = (args.target || process.env['TARGET_PLATFORM'] ||'all').toLowerCase()

  return fs
    .readdirSync(sourcePath)
    .reduce((prev: FilePath[], name) => {
      
      const folderPath = path.resolve(sourcePath, name)
      if (!fs.statSync(folderPath).isDirectory()) {
        return prev
      }
  
      const segments = name.split('@')
      const suffixTargetPlatform = segments[1] || ''
      const isTargetPlatform = target === 'all' || !suffixTargetPlatform || suffixTargetPlatform.toLowerCase() === target
      if (!isTargetPlatform) {
        return prev
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
        out: name
      })
      
      return prev
    }, [])
}
