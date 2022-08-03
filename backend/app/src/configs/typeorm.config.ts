import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from 'src/user/entity/user.entity'

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'transcendence',
  password: 'transcendence',
  database: 'transcendence',
  entities: [User],
  synchronize: true,
}