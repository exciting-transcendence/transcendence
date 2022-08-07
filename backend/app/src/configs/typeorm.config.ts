import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from 'user/user.entity'
import { FtUser } from 'auth/ft/ft-user.entity'

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'transcendence',
  password: process.env.DB_PASSWORD,
  database: 'transcendence',
  entities: [User, FtUser],
  synchronize: true,
}
