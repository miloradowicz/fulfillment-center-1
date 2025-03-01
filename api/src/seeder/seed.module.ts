import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SeederService } from './seeder.service'
import { Client, ClientSchema } from '../schemas/client.schema'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/fulfillment-center'),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [SeederService],
})
export class SeedModule {}
