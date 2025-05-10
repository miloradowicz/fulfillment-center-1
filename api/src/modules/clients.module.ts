import { Module } from '@nestjs/common'
import { ClientsController } from 'src/controllers/clients.controller'
import { DbModule } from './db.module'
import { ClientsService } from '../services/clients.service'
import { AuthModule } from './auth.module'
import { ProductsService } from 'src/services/products.service'
import { FilesModule } from './file-upload.module'
import { LogsService } from '../services/logs.service'

@Module({
  imports: [DbModule, AuthModule, FilesModule],
  controllers: [ClientsController],
  providers: [ClientsService, ProductsService, LogsService],
})
export class ClientsModule {}
