import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Translation {
  @PrimaryColumn()
  hash: string
  
  @Column()
  text: string
}


@Entity()
export class Novel {
  @PrimaryGeneratedColumn()
  id: string
  
  @Column()
  name: string
  
  @Column()
  type: string
  
  @Column()
  content: string
}
