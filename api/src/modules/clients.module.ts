import { Module } from '@nestjs/common'
import { ClientsController } from 'src/controllers/clients.controller'
import { DbModule } from './db.module'
import { ClientsService } from '../services/clients.service'
import { AuthModule } from './auth.module'

@Module({
  imports: [DbModule, AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
