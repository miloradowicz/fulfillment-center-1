import { Module } from '@nestjs/common'
import { DbModule } from './db/db.module'
import { ClientsController } from './clients/clients.controller'
import { ProductsController } from './products/products.controller'
import { ProductsService } from './products/products.service'
import { ArrivalsController } from './arrivals/arrivals.controller'
import { ArrivalsService } from './arrivals/arrivals.service'

@Module({
  imports: [DbModule],
  controllers: [ClientsController, ProductsController, ArrivalsController],
  providers: [ProductsService, ArrivalsService],
})
export class AppModule {}
