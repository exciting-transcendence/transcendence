import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import { UserPayload } from 'src/configs/jwt-token.config'

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async create(
    avata: string,
    nickname: string,
    twoFactor: boolean,
  ): Promise<User> {
    const user = new User()

    user.avata = avata
    user.nickname = nickname
    user.twoFactor = twoFactor
    user.isActive = true

    return await this.userRepository.save(user)
  }

  async findOne(uid: number): Promise<User> {
    return await this.userRepository.findOneBy({ uid })
  }

  async remove(uid: number): Promise<void> {
    await this.userRepository.delete({ uid })
  }

  issueToken(user: User) {
    const payload: UserPayload = {
      uidType: 'user',
      uid: user.uid,
      twoFactorPassed: !user.twoFactor,
    }
    return this.jwtService.sign(payload)
  }
}
