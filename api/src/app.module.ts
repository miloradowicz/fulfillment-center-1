import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Client, ClientSchema } from './schemas/client.schema'
import { ClientsController } from './clients/clients.controller'
import { Arrival, ArrivalSchema } from './schemas/arrival.schema'
import { ArrivalsController } from './arrivals/arrivals.controller'
import { ArrivalsService } from './arrivals/arrivals.service'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/fulfillment-center'),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: Arrival.name, schema: ArrivalSchema }]),
  ],
  controllers: [ClientsController, ArrivalsController],
  providers: [ArrivalsService],
})
export class AppModule {}
