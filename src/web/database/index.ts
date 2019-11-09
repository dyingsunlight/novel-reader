import { Connection, createConnection } from 'typeorm'
import { Translation } from "./entities"
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
      Translation
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
        const sqlitePath = Path.resolve(__dirname, '../../../', process.env['DATABASE_SQLITE_PATH'] || '.data/database.sqlite')
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

export default new DataBase()
