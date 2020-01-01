import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Translation {
  @PrimaryColumn()
  hash: string
  
  @Column()
  text: string
}

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: string
  
  @Column()
  name: string
  
  @Column({
    unique: true
  })
  username: string
  
  @Column({
    unique: true
  })
  email: string
  
  @Column()
  password: string
}

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @Column({
    unique: true
  })
  sessionId: string
  
  @Column({ type: 'datetime' })
  expired: Date
  
  @Column()
  username: string
}
