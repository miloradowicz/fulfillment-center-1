import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Client, ClientDocument } from '../schemas/client.schema'

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
  ) {}
  async seed() {
    await this.clientModel.deleteMany({})

    await this.clientModel.create({
      full_name: 'test',
      phone_number: '1 123-456-7890',
      email: 'test@gmail.com',
      inn: '123123',
      address: 'Малдыбаева 7/1',
      company_name: 'CHAPSAN',
      banking_data: '123123',
      ogrn: '123123',
    })
  }
}
