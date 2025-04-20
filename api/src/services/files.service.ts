import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'node:path'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Order, OrderDocument } from '../schemas/order.schema'
import { Arrival, ArrivalDocument } from '../schemas/arrival.schema'
const unlinkAsync = promisify(fs.unlink)

@Injectable()

export class FilesService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Arrival.name) private readonly arrivalModel: Model<ArrivalDocument>,
  ) {
  }

  getFilePath(filename: string): string {
    if (!filename) {
      console.error('Имя файла не определено')
      throw new BadRequestException('Имя файла не определено')
    }
    return path.join(process.cwd(), 'uploads', 'documents', filename)
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = this.getFilePath(filename)

    try {
      await unlinkAsync(filePath)
    } catch (error: unknown) {
      const err = error as NodeJS.ErrnoException
      if (err.code === 'ENOENT') {
        throw new NotFoundException('Файл не найден')
      }
      console.error('Ошибка при удалении файла:', err)
      throw new BadRequestException('Не удалось удалить файл')
    }
    const orderResult = await this.orderModel.updateOne(
      { 'documents.document': { $regex: filename, $options: 'i' } },
      { $pull: { documents: { document: { $regex: filename, $options: 'i' } } } }
    )

    if (orderResult.modifiedCount === 0) {
      const arrivalResult = await this.arrivalModel.updateOne(
        { 'documents.document': { $regex: filename, $options: 'i' } },
        { $pull: { documents: { document: { $regex: filename, $options: 'i' } } } }
      )

      if (arrivalResult.modifiedCount === 0) {
        console.warn(`Файл ${ filename } не найден ни в заказах, ни в поставках.`)
      }
    }
  }
}

