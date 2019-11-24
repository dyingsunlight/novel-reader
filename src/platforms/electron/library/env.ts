import * as fs from 'fs-extra'
import * as url from 'url'

export default function (filePath: string) {
  url.format({
    pathname: filePath,
    protocol: 'file:',
    slashes: true
  })
  const json: {[key: string]: string} = JSON.parse(fs.readFileSync(filePath).toString())
  Object.entries(json).forEach(([name, value]) => process.env[name] = value)
}
