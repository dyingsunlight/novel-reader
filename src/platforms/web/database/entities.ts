import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Translation {
  @PrimaryColumn()
  hash: string
  
  @Column()
  text: string
}
