import { BadRequestException, Injectable } from '@nestjs/common'
import { Document, Model, Types } from 'mongoose'
import { NotFoundError } from 'rxjs'

@Injectable()
export class LogsService {
  async addLogEntry<T extends Document>(model: Model<T>, id: string, logEntry: { user: Types.ObjectId, change: string }) {
    const document = await model.findById(id)

    if (!document) {
      throw new NotFoundError('Документ не найден')
    }

    if ('logs' in document && Array.isArray(document.logs)) {
      document.logs = [...document.logs as object[], logEntry]
      await document.save()

      return document.logs
    }
    else {
      throw new BadRequestException('Модель не поддерживает логирование.')
    }
  }

  async getAllLogEntries<T extends Document>(model: Model<T>, id: string) {
    const document = await model.findById(id)

    if (!document) {
      throw new NotFoundError('Документ не найден')
    }

    if ('logs' in document && Array.isArray(document.logs)) {
      return document.logs as object[]
    } else {
      return null
    }
  }
}
