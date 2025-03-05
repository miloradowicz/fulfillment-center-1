import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { UsersController } from '../controllers/users.controller'
import { UsersService } from '../services/user.service'

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
