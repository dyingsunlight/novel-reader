import MinioStorage from './minio'
import LocalFileStorage from './local-files'
import {NovelServices} from "novel-model"

let storage: NovelServices.Storage = null
let type = process.env['STORAGE_TYPE']

if (!type) {
  type = 'local'
}

if (type.toLowerCase() === 'minio') {
  storage = new MinioStorage()
} else if (type.toLowerCase() === 'local'){
  storage = new LocalFileStorage()
}

export default storage
