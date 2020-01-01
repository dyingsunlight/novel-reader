import db from '../database'
import { Session, User, UserError } from '../model'
import { compareSync, hashSync, hash } from "bcryptjs"

export default {
  async create(username: string, password: string, email: string, name: string = '') {
    
    const isUserExisted = await db.findUserByEmail(email) || await db.findUserByUsername(username)
    
    if (isUserExisted) {
      throw new Error(UserError.userExisted)
    }
    
    try {
      password =  await hash(password, 10)
      return await db.createUser(username, email, password, name)
    } catch (e) {
      console.error(e)
      throw new Error(UserError.unknown)
    }
  },
  
  async createSession(account: string, password): Promise<Session> {
    //
    // 1. Find user information
    //
    // TODO BETTER EMAIL REGEXP RECOGNIZER
    const isEmail = account.includes('@')
    let user
    try {
      if (isEmail) {
        user = await db.findUserByEmail(account)
      } else {
        user = await db.findUserByUsername(account)
      }
    } catch (e) {
      console.error(e)
      throw new Error(UserError.unknown)
    }
    if (!user) {
      throw new Error(UserError.userNotExisted)
    }
    //
    // 2. Ensure password is correct
    //
    const ensuredUser = <User>user
    
    if (!(await compareSync(password, ensuredUser.password))) {
      throw new Error(UserError.passwordError)
    }
    //
    // 3. Generate user session.
    //
    
    let session
    try {
      session = await db.createUserSession(ensuredUser.username)
    } catch (e) {
      console.error(e)
      throw new Error(UserError.unknown)
    }
    
    if (!session) {
      throw new Error(UserError.unknown)
    }
    return session
  },
  
  async removeSession(sessionId) {
    return await db.removeUserSession(sessionId)
  },
  
  async findUserBySession(sessionId: string): Promise<User|void> {
    return await db.findUserBySession(sessionId)
  }
}
