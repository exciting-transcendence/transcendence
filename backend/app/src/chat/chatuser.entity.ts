import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm'
import { User } from 'user/user.entity'

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  isAdmin: boolean

  @Column({ default: false })
  isOwner: boolean

  @ManyToOne(() => User)
  @JoinColumn()
  user: User
}
