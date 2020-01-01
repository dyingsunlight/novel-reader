import { Connection, createConnection } from 'typeorm'
import { Translation, User, Session } from "./entities"
import { PATH } from "platforms/constants"
import { User as UserModel, Session as SessionModel } from 'platforms/web/model'
import { v1 as uuid } from 'uuid'
import { randomString } from "shared/utils"
import * as Path from "path"
import Logger from "platforms/logger"

const logger = new Logger('web-database')

class DataBase {
  private connection: Connection = null
  private isInitialized = false
  
  constructor() {
    logger.verbose('initializing ...')
  
    this.initialize().then(() => {
      this.isInitialized = true
      logger.verbose('initialize done...')
    })
  }
  
  async initialize() {
    const databaseType = process.env['DATABASE_TYPE'] || 'sqlite'
    const entities = [
      Translation,
      User,
      Session
    ]
    try {
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
          const sqlitePath = process.env['DATABASE_SQLITE_PATH'] || Path.resolve(PATH.DATA, './.data/database.sqlite')
          logger.log('Sqlite Path is: ', sqlitePath)
          this.connection = await createConnection({
            type: "sqlite",
            entities,
            database: sqlitePath
          })
      }
      logger.verbose('Wait for connection synchronize ...')
      await this.connection.synchronize()
      logger.verbose('Connection synchronize completed...')
    } catch (e) {
      logger.error('Fatal error ', e)
      throw e
    }
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
  
  async createUser(username: string, email: string, password: string, name: string) {
    await this.waitUntilInitialized()
    const user = new User()
    
    user.name = name
    user.email = email
    user.password = password
    user.username = username
    
    const responsibility = this.connection.getRepository(User)
    
    const createdUser = await responsibility.save(user)
    
    return <UserModel>{
      name: createdUser.name,
      username: createdUser.username,
      email: createdUser.email,
      password: createdUser.password
    }
  }
  
  private async findUser(condition) {
    await this.waitUntilInitialized()
    
    const responsibility = this.connection.getRepository(User)
    const user = await responsibility.findOne(condition)
    
    if (!user) return
    
    return <UserModel>{
      name: user.username,
      username: user.username,
      email: user.email,
      password: user.password
    }
  }
  
  async findUserByEmail(email: string) {
    return this.findUser({email})
  }
  
  async findUserByUsername(username: string) {
    return this.findUser({username})
  }
  
  async findUserBySession(sessionId: string) {
    await this.waitUntilInitialized()
    
    const sessionResponsibility = this.connection.getRepository(Session)
    const foundSession = await sessionResponsibility.findOne({sessionId})
    if (!foundSession) return
    return await this.findUserByUsername(foundSession.username)
  }
  
  async createUserSession(username: string) {
    await this.waitUntilInitialized()
    
    const user = await this.findUser({username})
    if (!user) return
    
    const sessionResponsibility = this.connection.getRepository(Session)
    const session = new Session()
    const lifetime = 1000 * 60 * 60 * 24 * 7
    
    session.username = user.username
    session.sessionId = `${uuid()}-${randomString(15)}`
    session.expired = new Date(Date.now() + lifetime)
    
    await sessionResponsibility.save(session)
    
    return <SessionModel>{
      sessionId: session.sessionId,
      sessionExpireTime: session.expired.toUTCString()
    }
  }
  
  async removeUserSession(sessionId: string) {
    await this.connection.getRepository(Session).delete({sessionId})
  }
}

export default new DataBase()
