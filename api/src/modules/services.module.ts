import { Module } from '@nestjs/common'
import { ServicesController } from '../controllers/services.controller'
import { ServicesService } from '../services/services.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Service, ServiceSchema } from '../schemas/service.schema'
import { DbModule } from './db.module'
import { FilesModule } from './file-upload.module'

@Module({
  imports: [
    DbModule,
    FilesModule,
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
