import * as path from 'path'

export const PATH = {
  DATA: process.env['APP_USER_DATA_PATH'] || path.resolve(__dirname, '../../.data')
}
