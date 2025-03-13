import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { Product, ProductDocument } from '../schemas/product.schema'
import { User, UserDocument } from 'src/schemas/user.schema'

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  async seed() {
    await this.clientModel.deleteMany()
    await this.productModel.deleteMany()
    await this.userModel.deleteMany()

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

    const _users = await this.userModel.create({
      email: 'john@doe.com',
      password: '-',
      displayName: 'John Doe',
      role: 'super-admin',
      token: '-',
    })
  }
}
