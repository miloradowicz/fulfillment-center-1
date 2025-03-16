import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { TasksService } from '../services/tasks.service'
import { TasksController } from '../controllers/tasks.controller'
import { AuthModule } from './auth.module'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
