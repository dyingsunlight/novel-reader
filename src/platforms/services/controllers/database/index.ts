import {Connection, createConnection} from 'typeorm'
import {FileCache} from "./entities"
import {PATH} from "platforms/constants"
import * as Path from "path"

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
      FileCache
    ]
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
        const sqlitePath = Path.resolve(PATH.DATA, options.sqlitePath || 'services.sqlite')
        console.log('Services sqlite Path is: ', sqlitePath)
        this.connection = await createConnection({
          type: "sqlite",
          entities,
          database: sqlitePath
        })
    }
    
    await this.connection.synchronize()
    
  }
  
  async waitUntilInitialized() {
    let maxWaitTimes = 20
    let waitTime = 0
    
    while (!this.isInitialized && maxWaitTimes > waitTime++) {
      console.log('Pending for database initialized')
      await new Promise(resolve => setTimeout(resolve, 250))
    }
    
    if (!this.isInitialized) {
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
}

export default new Database()
