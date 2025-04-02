import { Module } from '@nestjs/common'
import { DbModule } from './db.module'
import { TasksService } from '../services/tasks.service'
import { TasksController } from '../controllers/tasks.controller'
import { AuthModule } from './auth.module'
import { CounterService } from '../services/counter.service'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService, CounterService],
})
export class TasksModule {}
