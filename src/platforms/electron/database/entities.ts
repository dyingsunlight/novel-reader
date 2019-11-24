import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: string
  
  @Column()
  key: string
  
  @Column()
  prefix: string

  @Column()
  value: string
}
