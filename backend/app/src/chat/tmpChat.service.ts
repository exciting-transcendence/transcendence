import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatRoom } from './chatroom.entity'
import { ChatUser } from './chatuser.entity'
import { User } from 'user/user.entity'

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
  ) {}

  async create(user: User): Promise<ChatRoom> {
    const room = new ChatRoom()
    let chatuser = new ChatUser()
    chatuser.user = user
    chatuser.isAdmin = true
    chatuser.isOwner = true
    chatuser = await this.chatUserRepository.save(chatuser)
    room.chatUser = []
    room.chatUser.push(chatuser)
    return await this.chatRoomRepository.save(room)
  }

  async addUser(user: User, id: number): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: id },
      relations: ['chatUser', 'chatUser.user'],
    })
    room.chatUser.map((chatUser) => {
      if (chatUser.user.uid === user.uid) {
        throw new BadRequestException('User already in room')
      }
    })
    let chatuser = new ChatUser()
    chatuser.user = user
    chatuser = await this.chatUserRepository.save(chatuser)
    room.chatUser.push(chatuser)
    return await this.chatRoomRepository.save(room)
  }

  async findByRoomid(id: number): Promise<ChatRoom> {
    return await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select([
        'chatRoom.id',
        'chatRoom.name',
        'chatRoom.type',
        'chatUser.isAdmin',
        'chatUser.isOwner',
        'user.id',
      ])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('chatRoom.id = :id', { id })
      .getOne()
  }

  async findAll(): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find({ relations: ['chatUser'] })
  }

  async findByUid(id: number): Promise<ChatRoom[]> {
    return await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .select(['chatRoom.id', 'chatRoom.name', 'chatRoom.type'])
      .leftJoin('chatRoom.chatUser', 'chatUser')
      .leftJoin('chatUser.user', 'user')
      .where('user.id = :id', { id })
      .getMany()
  }
}
