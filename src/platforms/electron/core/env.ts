import * as fs from 'fs-extra'
import * as url from 'url'
import { app } from 'electron'
import * as path from 'path'
// import Logger from 'platforms/logger'

// const logger = new Logger('env-initialize')

const initializeUserDataPath = () => {
  const UserDataPath = path.resolve(app.getPath('appData'), 'novel-reader')
  fs.ensureDirSync(UserDataPath)
  process.env['APP_USER_DATA_PATH'] = UserDataPath
  // logger.log('User Data Path: ', UserDataPath)
}

export default function (filePath: string) {
  url.format({
    pathname: filePath,
    protocol: 'file:',
    slashes: true
  })
  const json: {[key: string]: string} = JSON.parse(fs.readFileSync(filePath).toString())
  Object.entries(json).forEach(([name, value]) =>{
    process.env[name] = value
  
    // logger.log('\n--- Loading Preset ENV ---')
    // logger.log(name, value)
    // logger.log('\n--- Preset ENV Loaded---')
  })
  
  initializeUserDataPath()
}
