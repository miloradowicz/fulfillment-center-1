import { Injectable } from '@nestjs/common'
import { Types } from 'mongoose'
import { diff } from 'deep-diff'

export type DiffKind = 'N' | 'D' | 'E' | 'A';

interface BaseDiff {
  kind: DiffKind;
  path: (string | number)[];
}

interface DiffEdit<T = unknown> extends BaseDiff {
  kind: 'E';
  lhs?: T;
  rhs?: T;
}

interface DiffNew<T = unknown> extends BaseDiff {
  kind: 'N';
  rhs: T;
}

interface DiffDeleted<T = unknown> extends BaseDiff {
  kind: 'D';
  lhs: T;
}

interface DiffArray<T = unknown> extends BaseDiff {
  kind: 'A';
  index: number;
  item: Diff<T>;
}

type Diff<T = unknown> = DiffEdit<T> | DiffNew<T> | DiffDeleted<T> | DiffArray<T>;

export interface Log {
  user: Types.ObjectId;
  change: string;
  date: Date;
}

@Injectable()
export class LogsService {
  trackChanges(oldObj: Record<string, any>, newObj: Record<string, any>, userId: Types.ObjectId): Log | null {
    const changes = this.getDiffs(oldObj, newObj)
    if (!changes) return null

    const meaningfulChanges = this.filterMeaningfulDiffs(changes)

    if (meaningfulChanges.length === 0) return null

    const combinedMessage = meaningfulChanges
      .map(diff => this.formatDiffMessage(diff))
      .join('; ')

    return {
      user: userId,
      change: combinedMessage,
      date: new Date(),
    }
  }

  generateLogForCreate(userId: Types.ObjectId): Log {
    return {
      user: userId,
      change: 'Создан объект',
      date: new Date(),
    }
  }

  generateLogForArchive(userId: Types.ObjectId, archived: boolean): Log {
    return {
      user: userId,
      change: archived ? 'Архивирован объект' : 'Восстановлен объект',
      date: new Date(),
    }
  }

  private getDiffs(oldObj: Record<string, any>, newObj: Record<string, any>): Diff[] | undefined{
    const result = diff(oldObj, newObj)
    return (result || []) as Diff[]
  }

  private readonly IGNORED_PATHS = ['_id', 'createdAt', 'updatedAt', '__v', 'logs', 'documents', 'isArchived', 'arrivalNumber', 'orderNumber', 'taskNumber', 'invoiceNumber','date_ToDO', 'date_inProgress', 'date_Done', 'totalAmount', 'paymentStatus' ]

  private filterMeaningfulDiffs<T>(diffs: Diff<T>[]): Diff<T>[] {
    return diffs.filter(diff => {
      const path = diff.path?.[0]
      if (this.IGNORED_PATHS.includes(String(path))) return false

      if (diff.kind === 'D') {
        return diff.lhs !== null && diff.lhs !== undefined
      }

      if (diff.kind === 'N') {
        return true
      }

      if (diff.kind === 'E') {
        const lhs = (diff.lhs && typeof diff.lhs === 'object') ? diff.lhs.toString() : String(diff.lhs)
        const rhs = (diff.rhs && typeof diff.rhs === 'object') ? diff.rhs.toString() : String(diff.rhs)
        return lhs !== rhs
      }

      if (diff.kind === 'A') {
        const item = diff.item
        if (item.kind === 'N') {
          return typeof item.rhs !== 'object' || JSON.stringify(item.rhs) !== '{}'
        }

        if (item.kind === 'D') {
          return typeof item.lhs !== 'object' || JSON.stringify(item.lhs) !== '{}'
        }

        if (item.kind === 'E') {
          const lhs = (item.lhs && typeof item.lhs === 'object') ? item.lhs.toString() : String(item.lhs)
          const rhs = (item.rhs && typeof item.rhs === 'object') ? item.rhs.toString() : String(item.rhs)
          return lhs !== rhs
        }
      }

      return false
    })
  }

  private formatDiffMessage(diff: Diff): string {
    const path = diff.path.join('.')

    switch (diff.kind) {
    case 'N':
      return `Добавлено: ${ path } = ${ JSON.stringify(diff.rhs) }`

    case 'D':
      return `Удалено: ${ path } = ${ JSON.stringify(diff.lhs) }`

    case 'E':
      return `Изменено: ${ path } с ${ JSON.stringify(diff.lhs) } на ${ JSON.stringify(diff.rhs) }`

    case 'A': {
      const item = diff.item
      const indexPath = `${ path }[${ diff.index }]`

      switch (item.kind) {
      case 'N':
        return `Добавлено в массив ${ indexPath }: ${ JSON.stringify(item.rhs) }`
      case 'D':
        return `Удалено из массива ${ indexPath }: ${ JSON.stringify(item.lhs) }`
      case 'E':
        return `Изменено в массиве ${ indexPath }: с ${ JSON.stringify(item.lhs) } на ${ JSON.stringify(item.rhs) }`
      default:
        return `Изменение в массиве ${ indexPath }`
      }
    }

    default:
      return 'Неизвестное изменение'
    }
  }

}
