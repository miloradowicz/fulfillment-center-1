import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class LogDto {
  @IsNotEmpty({ message: 'Поле пользователь не должно быть пустым.' })
  @IsMongoId({ message: 'Некорректный формат ID' })
  user: string

  @IsNotEmpty({ message: 'Поле описание изменения не должно быть пустым.' })
  change: string

  @IsNotEmpty({ message: 'Поле дата изменения не должно быть пустым.' })
  date: Date
}

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Поле исполнитель обязательно для заполнения' })
  user: string

  @IsNotEmpty({ message: 'Поле заголовок задачи обязательно для заполнения' }) title: string

  @IsOptional()
  description?: string

  @IsOptional()
  @IsEnum(['к выполнению', 'в работе', 'готово'], {
    message: 'Статус должен быть одним из: "к выполнению", "в работе", "готово"',
  })
  status: 'к выполнению' | 'в работе' | 'готово'

  @IsOptional()
  @IsArray({ message: 'Заполните список логов.' })
  @ValidateNested({ each: true })
  @Type(() => LogDto)
  logs?: LogDto[]
}
