import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ChatUser } from './chatuser.entity'
import { RoomType } from './roomtype.enum'

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 'default_name' })
  name: string

  @Column({ default: RoomType.PUBLIC })
  type: RoomType

  @Column({ nullable: true })
  password: string

  @ManyToMany(() => ChatUser)
  @JoinTable()
  chatUser: ChatUser[]
}
