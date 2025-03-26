import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
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

  @IsNotEmpty({ message: 'Поле цена обязательно для заполнения.' })
  @IsPositive({ message: 'Поле цена должно быть положительным числом.' })
  price: number

  @IsOptional()
  @IsString({ message: 'Поле описание должно быть текстом.' })
  description: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LogDto)
  logs?: LogDto[]
}
