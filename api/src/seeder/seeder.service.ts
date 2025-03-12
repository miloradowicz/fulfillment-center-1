import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { Product, ProductDocument } from '../schemas/product.schema'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Arrival.name)
    private readonly arrivalModel: Model<ArrivalDocument>,
  ) {}

  async seed() {
    await this.clientModel.deleteMany({})
    await this.productModel.deleteMany({})
    await this.arrivalModel.deleteMany({})

    const _clients = await this.clientModel.create({
      name: 'CHAPSAN',
      phone_number: '1 123-456-7890',
      email: 'test@gmail.com',
      inn: '123123',
      address: 'Малдыбаева 7/1',
      banking_data: '123123',
      ogrn: '123123',
    })

    const _products = await this.productModel.create({
      client: _clients,
      title: 'Сарафан',
      amount: 7,
      barcode: '012345678901',
      article: '01234567',
      dynamic_fields: [
        {
          label: 'Размер',
          key: 'size',
          value: '42',
        },
        {
          label: 'Цвет',
          key: 'color',
          value: 'Красный',
        },
      ],
    })

    await this.arrivalModel.create(
      {
        client: _clients,
        products: [
          {
            product: _products,
            description: '',
            amount: 20,
          },
        ],
        arrival_price: 500,
        arrival_date: new Date().toISOString(),
        sent_amount: '2 короба',
      },
      {
        client: _clients,
        products: [
          {
            product: _products,
            description: '',
            amount: 100,
          },
        ],
        arrival_price: 2500,
        arrival_status: 'получена',
        arrival_date: new Date().toISOString(),
        sent_amount: '2 мешка',
      },
      {
        client: _clients,
        products: [
          {
            product: _products,
            description: '',
            amount: 30,
          },
        ],
        arrival_price: 1000,
        arrival_status: 'отсортирована',
        arrival_date: new Date().toISOString(),
        sent_amount: '5 коробов',
      },
    )
  }
}
