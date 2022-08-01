import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'transcendence',
    password: 'transcendence',
    database: 'transcendence',
    entities: [
      __dirname + '/**/*.entity.{js,ts}'
    ],
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
