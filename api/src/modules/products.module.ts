import { Module } from '@nestjs/common'
import { ProductsController } from 'src/controllers/products.controller'
import { ProductsService } from 'src/services/products.service'
import { DbModule } from './db.module'

@Module({
  imports: [DbModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
