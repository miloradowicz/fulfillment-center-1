import { Module } from '@nestjs/common'
import { ClientsController } from 'src/controllers/clients.controller'
import { DbModule } from './db.module'

@Module({
  imports: [DbModule],
  controllers: [ClientsController],
})
export class ClientsModule {}
