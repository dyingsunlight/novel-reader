import { Connection, createConnection } from 'typeorm'
import { Storage } from "./entities"
import { PATH } from "platforms/constants"
import * as Path from "path"

class DataBase {
  private connection: Connection = null
  private isInitialized = false
  
  constructor() {
    this.initialize().then(() => {
      this.isInitialized = true
    })
  }
  
  async initialize() {
    const databaseType = process.env['DATABASE_TYPE'] || 'sqlite'
    const entities = [
      Storage
    ]
    switch (databaseType) {
      case 'mysql':
        this.connection = await createConnection({
          type: "mysql",
          host: process.env['DATABASE_MYSQL_HOST'] || 'localhost',
          port: Number(process.env['DATABASE_MYSQL_PORT'] || 3306),
          username: process.env['DATABASE_MYSQL_USERNAME'] || 'root',
          password: process.env['DATABASE_MYSQL_PASSWORD'] || 'password',
          database: process.env['DATABASE_NAME'] || 'moonset',
          entities
        })
        break
      default:
        const sqlitePath = Path.resolve(PATH.DATA, './electron.sqlite')
        console.log('Sqlite Path is: ', sqlitePath)
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
  
  async getStorageItem(prefix: string, key: string) {
    await this.waitUntilInitialized()
    const item = await this.connection.getRepository(Storage).findOne({prefix, key})
    if (item) return {
      prefix: item.prefix,
      value: item.value,
      id: item.id,
      key: item.key
    }
  }
  
  async addStorageItem(prefix: string, key: string, value: string) {
    await this.waitUntilInitialized()
    const item = new Storage()
    item.prefix = prefix
    item.key = key
    item.value = value
    const responsibility = this.connection.getRepository(Storage)
    await responsibility.save(item)
  }
  
  async removeStorageItem(prefix: string, key: string): Promise<string|void> {
    await this.waitUntilInitialized()
    await this.connection.getRepository(Storage).delete({prefix, key})
  }
  
  async removeStorage(prefix: string): Promise<string|void> {
    await this.waitUntilInitialized()
    await this.connection.getRepository(Storage).delete({prefix})
  }
  
  async keysOfStorage(prefix: string): Promise<string[]> {
    await this.waitUntilInitialized()
    const items = await this.connection.getRepository(Storage).find({prefix})
    return items.map(item => item.key)
  }
  
  async sizeOfStorage(prefix: string): Promise<number> {
    await this.waitUntilInitialized()
    const items = await this.connection.getRepository(Storage).find({prefix})
    return items.reduce((sum, item) => sum + item.value.length , 0)
  }
  
  
  async updateStoreItem(id: string, value: string):Promise<any> {
    await this.waitUntilInitialized()
    const repository = this.connection.getRepository(Storage)
    const item = await repository.findOne({id})
    if (item) {
      item.value = value
      await repository.save(item)
    }
  }
}

export default new DataBase()
