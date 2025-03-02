import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Client, ClientSchema } from './schemas/client.schema'
import { ClientsController } from './clients/clients.controller'
import { Arrival, ArrivalSchema } from './schemas/arrival.schema'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/fulfillment-center'),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: Arrival.name, schema: ArrivalSchema }]),
  ],
  controllers: [ClientsController],
  providers: [],
})
export class AppModule {}
