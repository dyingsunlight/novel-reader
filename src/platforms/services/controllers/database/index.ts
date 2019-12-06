import {Connection, createConnection} from 'typeorm'
import {FileCache, Translation} from "./entities"
import {PATH} from "platforms/constants"
import * as Path from "path"
import Logger from 'platforms/logger'

const logger = new Logger('services-database')

class Database {
  private connection: Connection = null
  private isInitialized = false
  
  constructor(options = {}) {
    this.initialize(options).then(() => {
      this.isInitialized = true
    })
  }
  
  async initialize(options) {
    const databaseType = options.tpye || 'sqlite'
    const entities = [
      FileCache,
      Translation
    ]
    logger.log('databaseType is ', databaseType)
  
    switch (databaseType) {
      case 'mysql':
        this.connection = await createConnection({
          type: "mysql",
          host: options.mysqlHost || 'localhost',
          port: Number(options.mysqlPort || 3306),
          username: options.mysqlUsername || 'root',
          password: options.mysqlPassword || 'password',
          database: options.mysqlName || 'database',
          entities
        })
        break
      default:
        const sqlitePath = Path.resolve(PATH.DATA, 'services.sqlite')
        logger.log('Services sqlite Path is: ', sqlitePath)
        this.connection = await createConnection({
          type: "sqlite",
          entities,
          database: sqlitePath
        })
    }
    logger.log('Wait for connection synchronize ...')
    await this.connection.synchronize()
    logger.log('Connection synchronize completed...')
  }
  
  async waitUntilInitialized() {
    let maxWaitTimes = 20
    let waitTime = 0
    
    while (!this.isInitialized && maxWaitTimes > waitTime++) {
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    
    if (!this.isInitialized) {
      logger.error('Wait for database connection initialized timeout')
      throw new Error('Wait for database initialized timeout')
    }
  }
  
  async createFileCache(hash, url) {
    await this.waitUntilInitialized()
    const newItem = new FileCache()
    // Noel name
    newItem.hash = hash
    newItem.url = url
    newItem.created = new Date()
    const createItem = await this.connection.getRepository(FileCache).save(newItem)
    return {
      hash: createItem.hash,
      url: createItem.url,
      created: createItem.created
    }
  }
  
  async updateFileCache(hash, url) {
    await this.waitUntilInitialized()
    const repository = await this.connection.getRepository(FileCache)
    const existedItem = await repository.findOne({hash})
    if (existedItem) {
      if (existedItem.url !== url) {
        existedItem.url = url
        await repository.save(existedItem)
      }
      return {
        hash: existedItem.hash,
        url: existedItem.url,
        created: existedItem.created
      }
    } else {
      return this.createFileCache(hash, url)
    }
  }
  
  async removeFileCache(hash: string) {
    await this.waitUntilInitialized()
    await this.connection.getRepository(FileCache).delete({hash})
  }
  
  async findFileCache(hash: string) {
    await this.waitUntilInitialized()
    const item = await this.connection.getRepository(FileCache).findOne({hash})
    if (item) {
      return {
        hash: item.hash,
        url: item.url,
        created: item.created
      }
    }
  }
  
  async findTranslationCache(hash: string): Promise<string|void> {
    await this.waitUntilInitialized()
    const item = await this.connection.getRepository(Translation).findOne({hash})
    if (item) return item.text
  }
  
  async createTransltionCache(hash, text) {
    await this.waitUntilInitialized()
    const item = new Translation()
    item.hash = hash
    item.text = text
    const responsibility = this.connection.getRepository(Translation)
    await responsibility.save(item)
  }
}

export default new Database()
