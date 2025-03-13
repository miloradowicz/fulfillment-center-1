import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { Product, ProductDocument } from '../schemas/product.schema'
import { Task, TaskDocument } from '../schemas/task.schema'
import { User, UserDocument } from '../schemas/user.schema'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { randomUUID } from 'node:crypto'
import { Service, ServiceDocument } from '../schemas/service.schema'
import { Stock, StockDocument } from '../schemas/stock.schema'

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Arrival.name)
    private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(Stock.name)
    private readonly stockModel: Model<StockDocument>,
  ) {}

  async seed() {
    await this.clientModel.deleteMany({})
    await this.productModel.deleteMany({})
    await this.taskModel.deleteMany({})
    await this.userModel.deleteMany({})
    await this.arrivalModel.deleteMany({})
    await this.serviceModel.deleteMany({})
    await this.stockModel.deleteMany({})

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
      client: _clients._id,
      title: 'Сарафан',
      amount: 7,
      barcode: '012345678901',
      article: '01234567',
      dynamic_fields: [
        { label: 'Размер', key: 'size', value: '42' },
        { label: 'Цвет', key: 'color', value: 'Красный' },
      ],
    })

    const [_User1, _User2] = await this.userModel.create([
      {
        email: 'test@gmail.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Мария',
        role: 'stock-worker',
        token: randomUUID(),
      },
      {
        email: 'test1@gmail.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Вася',
        role: 'stock-worker',
        token: randomUUID(),
      },
    ])

    await this.taskModel.create([
      {
        user: _User1._id,
        title: 'Принять товар из поставки №2248239487',
        description: 'Проверить товар на дефекты и внести информацию в базу',
        status: 'к выполнению',
      },
      {
        user: _User2._id,
        title: 'Собрать заказ №12423424',
        status: 'в работе',
      },
      {
        user: _User1._id,
        title: 'Упаковка товара для заказа №12423424',
        status: 'готово',
      },
      {
        user: _User2._id,
        title: 'Проверить складские остатки',
        status: 'в работе',
      },
      {
        user: _User1._id,
        title: 'Связаться с клиентом по заказу №556677',
        status: 'готово',
      },
    ])

    await this.arrivalModel.create([
      {
        client: _clients,
        products: [{ product: _products, description: '', amount: 20 }],
        arrival_price: 500,
        arrival_date: new Date().toISOString(),
        sent_amount: '2 короба',
      },
      {
        client: _clients,
        products: [{ product: _products, description: '', amount: 100 }],
        arrival_price: 2500,
        arrival_status: 'получена',
        arrival_date: new Date().toISOString(),
        sent_amount: '2 мешка',
      },
      {
        client: _clients,
        products: [{ product: _products, description: '', amount: 30 }],
        arrival_price: 1000,
        arrival_status: 'отсортирована',
        arrival_date: new Date().toISOString(),
        sent_amount: '5 коробов',
      },
    ])

    await this.serviceModel.create([
      {
        name: 'Работа с товаром',
        dynamic_fields: [
          { key: '1', label: 'Приемка, пересчёт товара', value: '500 сом' },
          { key: '2', label: 'Маркировка двойная', value: '300 сом' },
        ],
      },
      {
        name: 'Забор товара',
        dynamic_fields: [
          { key: '3', label: 'Погрузка-Разгрузка на складе фулфилмента', value: '700 сом' },
          { key: '4', label: 'Забор с другого адреса', value: '1000 сом' },
        ],
      },
    ])

    await this.stockModel.create({
      name: 'Склад Бишкек',
      address: 'Ул. Малдыбаева 7/1',
      products: [{ product: _products, description: '', amount: 20 }],
    })
  }
}
