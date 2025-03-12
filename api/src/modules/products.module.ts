import { Module } from '@nestjs/common'
import { ProductsController } from 'src/controllers/products.controller'
import { ProductsService } from 'src/services/products.service'
import { DbModule } from './db.module'
import { FilesModule } from './file-upload.module'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from '../schemas/product.schema'

@Module({
  imports: [
    DbModule,
    FilesModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
