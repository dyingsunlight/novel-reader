import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class FileCache {
  @PrimaryColumn()
  hash: string
  
  @Column()
  url: string
  
  @Column({ type: 'datetime' })
  created: Date
}

@Entity()
export class Translation {
  @PrimaryColumn()
  hash: string
  
  @Column()
  text: string
}
