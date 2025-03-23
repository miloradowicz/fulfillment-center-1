import { ClientSession, Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Counter, CounterDocument } from '../schemas/counter.schema'

@Injectable()
export class CounterService {
  constructor(@InjectModel(Counter.name) private counterModel: Model<CounterDocument>) {}

  async getNextSequence(sequenceName: string, session?: ClientSession): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { name: sequenceName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    ).lean()
    return counter ? counter.seq : 1
  }
}
