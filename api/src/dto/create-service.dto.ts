import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import mongoose from 'mongoose'

class LogDto {
  @IsNotEmpty({ message: 'Заполните поле пользователя.' })
  user: string

  @IsNotEmpty({ message: 'Заполните описание изменения.' })
  change: string

  @IsNotEmpty({ message: 'Заполните дату изменения.' })
  date: Date
}

class DynamicFieldDto {
  @IsNotEmpty({ message: 'Поле ключ обязательно для заполнения' })
  key: string

  @IsNotEmpty({ message: 'Поле лейбл обязательно для заполнения' })
  label: string

  @IsNotEmpty({ message: 'Поле значение обязательно для заполнения' })
  value: string
}

export class CreateServiceDto {
  @IsNotEmpty({ message: 'Поле наименование обязательно для заполнения.' })
  name: string

  @IsNotEmpty({ message: 'Поле категория услуги обязательно для заполнения.' })
  serviceCategory: mongoose.Schema.Types.ObjectId

  @ValidateNested({ each: true })
  @Type(() => DynamicFieldDto)
  dynamic_fields: DynamicFieldDto[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LogDto)
  logs?: LogDto[]
}
