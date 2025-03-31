import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'
import { Product, ProductDocument } from '../schemas/product.schema'
import { User, UserDocument } from 'src/schemas/user.schema'
import { Task, TaskDocument } from '../schemas/task.schema'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
import { randomUUID } from 'node:crypto'
import { Service, ServiceDocument } from '../schemas/service.schema'
import { Stock, StockDocument } from '../schemas/stock.schema'
import { Order, OrderDocument } from '../schemas/order.schema'
import { Counter, CounterDocument } from '../schemas/counter.schema'
import { Counterparty, CounterpartyDocument } from '../schemas/counterparty.schema'
import { ServiceCategory, ServiceCategoryDocument } from '../schemas/service-category.schema'

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Arrival.name)
    private readonly arrivalModel: Model<ArrivalDocument>,
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(Stock.name)
    private readonly stockModel: Model<StockDocument>,
    @InjectModel(Counter.name)
    private readonly counterModel: Model<CounterDocument>,
    @InjectModel(Counterparty.name)
    private readonly counterpartyModel: Model<CounterpartyDocument>,
    @InjectModel(ServiceCategory.name)
    private readonly serviceCategoryModel: Model<ServiceCategoryDocument>,
  ) {}

  async seed() {
    await this.userModel.deleteMany()
    await this.clientModel.deleteMany({})
    await this.productModel.deleteMany({})
    await this.taskModel.deleteMany({})
    await this.orderModel.deleteMany({})
    await this.arrivalModel.deleteMany({})
    await this.serviceModel.deleteMany({})
    await this.stockModel.deleteMany({})
    await this.counterModel.deleteMany({})
    await this.counterpartyModel.deleteMany({})
    await this.serviceCategoryModel.deleteMany({})

    const [_User1, _User2, _admin, _User3, _User4, _User5, _User6, _User7] = await this.userModel.create([
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
        displayName: 'Оля Макарова',
        role: 'stock-worker',
        token: randomUUID(),
      },
      {
        email: 'john@doe.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Admin',
        role: 'super-admin',
        token: randomUUID(),
      },
      {
        email: 'john@doe1.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Артем Иванов',
        role: 'super-admin',
        token: randomUUID(),
      },
      {
        email: 'john@doe12.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Игорь',
        role: 'super-admin',
        token: randomUUID(),
      },
      {
        email: 'john1234@doe.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Кристина',
        role: 'super-admin',
        token: randomUUID(),
      },
      {
        email: 'john123а4@doe.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        displayName: 'Саша',
        role: 'super-admin',
        token: randomUUID(),
      },
    ])

    const _clients = await this.clientModel.create({
      name: 'CHAPSAN',
      phone_number: '1 123-456-7890',
      email: 'test@gmail.com',
      inn: '123123',
      address: 'Малдыбаева 7/1',
      banking_data: '123123',
      ogrn: '123123',
    })

    const [_product1, _product2, _product3] = await this.productModel.create([
      {
        client: _clients._id,
        title: 'Сарафан',
        barcode: '012345678901',
        article: '01234567',
        dynamic_fields: [
          { label: 'Размер', key: 'size', value: '42' },
          { label: 'Цвет', key: 'color', value: 'Красный' },
        ],
      },
      {
        client: _clients._id,
        title: 'Джинсы',
        barcode: '987654321012',
        article: '987654',
        dynamic_fields: [
          { label: 'Размер', key: 'size', value: '48' },
          { label: 'Цвет', key: 'color', value: 'Синий' },
        ],
      },
      {
        client: _clients._id,
        title: 'Футболка',
        barcode: '567890123456',
        article: '567890',
        dynamic_fields: [
          { label: 'Размер', key: 'size', value: 'L' },
          { label: 'Цвет', key: 'color', value: 'Белый' },
        ],
        logs: [
          { user: _User1, change: 'record #1', date: new Date().toISOString() },
          { user: _User1, change: 'record #2', date: new Date().toISOString() },
          { user: _User1, change: 'record #3', date: new Date().toISOString() },
          { user: _User2, change: 'record #4', date: new Date().toISOString() },
        ],
      },
    ])

    const [_order1, _order2, _order3] = await this.orderModel.create([
      {
        orderNumber: 'ORD-1',
        client: _clients._id,
        products: [
          { product: _product1._id, description: 'Заказ 1 - Сарафан', amount: 2 },
          { product: _product2._id, description: 'Заказ 1 - Джинсы', amount: 1 },
        ],
        price: 2500,
        sent_at: new Date().toISOString(),
        delivered_at: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
        status: 'в сборке',
      },
      {
        orderNumber: 'ORD-2',
        client: _clients._id,
        products: [
          { product: _product2._id, description: 'Заказ 2 - Джинсы', amount: 2 },
          { product: _product3._id, description: 'Заказ 2 - Футболка', amount: 3 },
        ],
        price: 4500,
        sent_at: new Date().toISOString(),
        delivered_at: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
        status: 'в пути',
      },
      {
        orderNumber: 'ORD-3',
        client: _clients._id,
        products: [
          { product: _product1._id, description: 'Заказ 3 - Сарафан', amount: 1 },
          { product: _product3._id, description: 'Заказ 3 - Футболка', amount: 2 },
        ],
        price: 1900,
        sent_at: new Date().toISOString(),
        delivered_at: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        status: 'доставлен',
      },
    ])

    await this.counterModel.findOneAndUpdate(
      { name: 'order' },
      { $set: { seq: 3 } },
      { upsert: true }
    )

    const [_stock1, _stock2] = await this.stockModel.create([
      {
        name: 'Склад Бишкек',
        address: 'Ул. Малдыбаева 7/1',
        products: [{ product: _product1._id, amount: 20 }],
      },
      {
        name: 'Склад Москва',
        address: 'Ул. Гагарина 102',
        products: [{ product: _product2._id, amount: 20 }],
      },
    ])

    const [_counterparty1, _counterparty2, _counterparty3] = await this.counterpartyModel.create([
      {
        name: 'ООО "Фулфилмент Партнер"',
        phone_number: '+7 999 123-45-67',
        address: 'Москва, ул. Достоевского, д. 10',
      },
      {
        name: 'ИП Осмонов',
        phone_number: '+996 700 456-789',
        address: 'Бишкек, пр. Чуй, д. 55',
      },
      {
        name: 'OОО "Складской Логистик"',
        phone_number: '+996 500 789-456',
        address: 'Бишкек, пр. Манаса, д. 30',
      },
    ])

    const [_arrival1, _arrival2, _arrival3] = await this.arrivalModel.create([
      {
        arrivalNumber: 'ARL-1',
        client: _clients._id,
        products: [{ product: _product1._id, description: '', amount: 20 }],
        arrival_price: 500,
        arrival_date: new Date().toISOString(),
        sent_amount: '2 короба',
        stock: _stock1._id,
        shipping_agent: _counterparty2._id,
        pickup_location: 'Ул. Пушкина, д. 67',
      },
      {
        arrivalNumber: 'ARL-2',
        client: _clients._id,
        products: [{ product: _product2._id, description: '', amount: 100 }],
        arrival_price: 2500,
        arrival_status: 'получена',
        arrival_date: new Date().toISOString(),
        sent_amount: '2 мешка',
        stock: _stock2._id,
        logs: [
          { user: _User2, change: 'record #1', date: new Date().toISOString() },
          { user: _User1, change: 'record #2', date: new Date().toISOString() },
          { user: _admin, change: 'record #3', date: new Date().toISOString() },
          { user: _User2, change: 'record #4', date: new Date().toISOString() },
        ],
      },
      {
        arrivalNumber: 'ARL-3',
        client: _clients._id,
        products: [{ product: _product3._id, description: '', amount: 30 }],
        arrival_price: 1000,
        arrival_status: 'отсортирована',
        arrival_date: new Date().toISOString(),
        sent_amount: '5 коробов',
        stock: _stock1._id,
        shipping_agent: _counterparty1._id,
        pickup_location: 'Ул. Авиаторов, д. 88',
      },
    ])

    await this.counterModel.findOneAndUpdate(
      { name: 'arrival' },
      { $set: { seq: 3 } },
      { upsert: true }
    )

    await this.taskModel.create([
      {
        user: _User1._id,
        title: 'Принять товар из поставки',
        description: 'Проверить товар на дефекты и внести информацию в базу',
        status: 'к выполнению',
        type: 'поставка',
        associated_arrival: _arrival1._id,
      },
      {
        user: _User2._id,
        title: 'Собрать заказ',
        status: 'в работе',
        type: 'заказ',
        associated_order: _order2._id,
      },
      {
        user: _User1._id,
        title: 'Упаковка товара для заказа',
        status: 'готово',
        type: 'другое',
        date_Done: '2025-03-29T08:27:17.078Z',
      },
      {
        user: _User2._id,
        title: 'Проверить складские остатки',
        status: 'в работе',
        type: 'другое',
      },
      {
        user: _User1._id,
        title: 'Связаться с клиентом по заказу',
        status: 'готово',
        type: 'заказ',
        associated_order: _order2._id,
        date_Done: '2025-03-23T08:27:17.078Z',
      },
      {
        user: _User4._id,
        title: 'Связаться с клиентом по заказу',
        status: 'готово',
        type: 'заказ',
        associated_order: _order2._id,
        date_Done: '2025-03-20T08:27:17.078Z',
      },
      {
        user: _User3._id,
        title: 'Связаться с клиентом по заказу',
        status: 'готово',
        type: 'заказ',
        associated_order: _order2._id,
        date_Done: '2025-03-21T08:27:17.078Z',
      },
      {
        user: _User3._id,
        title: 'Связаться с клиентом по заказу',
        status: 'готово',
        type: 'заказ',
        associated_order: _order2._id,
        date_Done: '2025-03-22T08:27:17.078Z',
      },
      {
        user: _User1._id,
        title: 'Решить вопрос по начислению оплаты по заказу',
        status: 'готово',
        type: 'заказ',
        associated_order: _order2._id,
        date_Done: '2025-03-23T08:27:17.078Z',
      },
      {
        user: _User5._id,
        title: 'Связаться с клиентом ',
        status: 'готово',
        type: 'другое',
        date_Done: '2025-03-26T08:27:17.078Z',
      },
      {
        user: _User6._id,
        title: 'Узнать информацию у клиента по прибытию поставки ',
        status: 'к выполнению',
        type: 'поставка',
        associated_arrival: _arrival2._id,
        date_Done: '2025-03-28T08:27:17.078Z',
      },
    ])

    const [_serviceCat1, _serviceCat2] = await this.serviceCategoryModel.create([
      {
        name: 'Работа с товаром',
        isArchived: false,
      },
      {
        name: 'Дополнительные услуги',
        isArchived: false,
      }]
    )

    await this.serviceModel.create([
      {
        name: 'Работа с товаром по прибытию на склад',
        serviceCategory: _serviceCat1._id,
        dynamic_fields: [
          { key: '5', label: 'Приемка, пересчёт товара', value: '500 сом' },
          { key: '6', label: 'Маркировка двойная', value: '300 сом' },
        ],
      },
      {
        name: 'Замена/установка бирки',
        serviceCategory: _serviceCat1._id,
        dynamic_fields: [
          { key: '7', label: 'Погрузка-Разгрузка на складе фулфилмента', value: '700 сом' },
          { key: '8', label: 'Забор с другого адреса', value: '1000 сом' },
        ],
      },
      {
        name: 'Создание поставки в ЛК селлера (до 10 артикулов)',
        serviceCategory: _serviceCat2._id,
        dynamic_fields: [
          { key: '9', label: 'Погрузка-Разгрузка на складе фулфилмента', value: '700 сом' },
          { key: '10', label: 'Забор с другого адреса', value: '1000 сом' },
        ],
      },
    ])
  }
}
