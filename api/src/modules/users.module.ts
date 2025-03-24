import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { UsersController } from '../controllers/users.controller'
import { UsersService } from '../services/user.service'
import { AuthModule } from './auth.module'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
