import {Column, Entity, PrimaryColumn} from "typeorm"

@Entity()
export class Translation {
  @PrimaryColumn()
  hash: string
  
  @Column()
  text: string
}

