import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'

interface EntityLog {
  user: mongoose.Types.ObjectId
  date: Date
  change: string
}

@Injectable()
export class LogsService {
  compareArrays(oldArr: unknown[], newArr: unknown[], idKey = 'product'): string[] {
    const change: string[] = []

    const getId = (item: unknown): string | number | undefined => {
      if (typeof item === 'object' && item !== null && idKey in item) {
        return (item as Record<string, unknown>)[idKey] as string | number
      }
      return undefined
    }

    const oldMap = new Map<string | number, Record<string, unknown>>()
    const newMap = new Map<string | number, Record<string, unknown>>()

    for (const item of oldArr) {
      const id = getId(item)
      if (id !== undefined && typeof item === 'object' && item !== null) {
        oldMap.set(id, item as Record<string, unknown>)
      }
    }

    for (const item of newArr) {
      const id = getId(item)
      if (id !== undefined && typeof item === 'object' && item !== null) {
        newMap.set(id, item as Record<string, unknown>)
      }
    }

    for (const [id, newItem] of newMap.entries()) {
      const oldItem = oldMap.get(id)

      if (!oldItem) {
        change.push(`Добавлен элемент с ${ idKey }=${ id }`)
        continue
      }

      for (const key of Object.keys(newItem)) {
        const newVal = newItem[key]
        const oldVal = oldItem[key]
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          change.push(
            `${ idKey }=${ id }: поле '${ key }' изменено с '${ this.formatValue(oldVal) }' на '${ this.formatValue(newVal) }'`
          )
        }
      }
    }

    for (const id of oldMap.keys()) {
      if (!newMap.has(id)) {
        change.push(`Удалён элемент с ${ idKey }=${ id }`)
      }
    }

    return change
  }

  formatValue(value: unknown): string {
    if (typeof value === 'object' && value !== null) {
      try {
        return JSON.stringify(value)
      } catch {
        return '[не удаётся преобразовать объект]'
      }
    }
    return String(value)
  }

  createLog(userId: mongoose.Types.ObjectId): EntityLog {
    return {
      user: userId,
      date: new Date(),
      change: 'Создано',
    }
  }

  updateLog(
    userId: mongoose.Types.ObjectId,
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>,
  ): EntityLog {
    const change: string[] = []

    for (const [key, newVal] of Object.entries(newData)) {
      const oldVal = oldData?.[key]

      if (Array.isArray(newVal) && Array.isArray(oldVal)) {
        const arrayChanges = this.compareArrays(oldVal, newVal)
        if (arrayChanges.length) change.push(...arrayChanges)
        continue
      }

      const safeOldVal = oldVal ? this.formatValue(oldVal) : 'не указано'
      const safeNewVal = newVal ? this.formatValue(newVal) : 'не указано'

      if (safeOldVal !== safeNewVal) {
        change.push(`${ key } изменено с '${ safeOldVal }' на '${ safeNewVal }'`)
      }
    }

    return {
      user: userId,
      date: new Date(),
      change: change.length ? change.join('; ') : 'Без изменений',
    }
  }

  archiveLog(userId: mongoose.Types.ObjectId, archived: boolean): EntityLog {
    return {
      user: userId,
      date: new Date(),
      change: archived ? 'Перемещено в архив' : 'Восстановлено из архива',
    }
  }
}
