import { Module } from '@nestjs/common'
import { ClientsController } from './clients/clients.controller'
import { ProductsController } from './products/products.controller'
import { ProductsService } from './products/products.service'
import { DbModule } from './db/db.module'

@Module({
  imports: [DbModule],
  controllers: [ClientsController, ProductsController],
  providers: [ProductsService],
})
export class AppModule {}
