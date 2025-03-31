import { Module } from '@nestjs/common'
import { ServicesController } from '../controllers/services.controller'
import { ServicesService } from '../services/services.service'
import { DbModule } from './db.module'
import { FilesModule } from './file-upload.module'
import { AuthModule } from './auth.module'

@Module({
  imports: [
    DbModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule { }
