import { Module } from '@nestjs/common'
import { ClientsController } from 'src/controllers/clients.controller'
import { DbModule } from './db.module'
import { ClientsService } from '../services/clients.service'

@Module({
  imports: [DbModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
