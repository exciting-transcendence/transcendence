import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt'
import { FtStrategy } from './ft.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '600s' },
    })
  ],
  providers: [UserService, FtStrategy],
  controllers: [UserController, AuthController],
  exports: [UserService]
})
export class UserModule {}
